import sys
import pandas as pd
from sqlalchemy import create_engine, text

if len(sys.argv) < 2:
    print("Error: No se proporcionó el nombre del archivo CSV.")
    sys.exit(1)

csv_file = sys.argv[1]

df = pd.read_csv(csv_file)

personas_df = df[['nombre', 'apellido', 'telefono_movil', 'ocupacion', 'correo_electronico', 'asistencia']].copy()
personas_df['ocupacion'] = personas_df['ocupacion'].str.lower()
estudiantes_df = df[['correo_electronico', 'carrera', 'universidad']].dropna(subset=['carrera', 'universidad']).copy()
profesionales_df = df[['correo_electronico', 'organizacion', 'trabajo']].dropna(subset=['organizacion', 'trabajo']).copy()

USER = "root"
PASSWORD = "UAxgbfibezWmZpWKvXBANZtRbWuvcObR"
HOST = "viaduct.proxy.rlwy.net"
PORT = "49882"
BD = "railway2"
db_url = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/{BD}"
engine = create_engine(db_url)

try:
    with engine.connect() as connection:
        print("Conexión exitosa")

        personas_df.to_sql('personas', con=engine, if_exists='append', index=False)
        
        result = connection.execute(text("SELECT id_persona, correo_electronico FROM personas")).fetchall()
        id_map = pd.DataFrame(result, columns=['id_persona', 'correo_electronico']).set_index('correo_electronico').to_dict()['id_persona']
        
        estudiantes_df['id_persona'] = estudiantes_df['correo_electronico'].map(id_map)
        profesionales_df['id_persona'] = profesionales_df['correo_electronico'].map(id_map)

        estudiantes_df.dropna(subset=['id_persona'], inplace=True)
        profesionales_df.dropna(subset=['id_persona'], inplace=True)

        estudiantes_df[['id_persona', 'carrera', 'universidad']].to_sql('estudiantes', con=engine, if_exists='append', index=False)
        profesionales_df[['id_persona', 'organizacion', 'trabajo']].to_sql('profesionales', con=engine, if_exists='append', index=False)

        print("Datos insertados correctamente")

except Exception as e:
    print(f"Error de conexión: {e}")
