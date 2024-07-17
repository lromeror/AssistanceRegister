import pandas as pd
import sys
import pandas as pd
from dash import no_update
import dash_daq as daq
from sqlalchemy.exc import SQLAlchemyError
import numpy as np
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

data = pd.read_excel("assets/Data/Registro Conferencia de WiDS Guayaquil@ESPOL 2024 (respuestas).csv,engine="")
# Configuración de la conexión a la base de datos
USER = "root"
PASSWORD = "UAxgbfibezWmZpWKvXBANZtRbWuvcObR"
HOST = "viaduct.proxy.rlwy.net"
PORT = "49882"
BD = "railway2"
db_url = f"mysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{BD}"
engine = create_engine(db_url)
try:
    connection = engine.connect()
    print("Conexión exitosa")
    connection.close()
except Exception as e:
    print(f"Error de conexión: {e}")

def formatDf(df):
    df = df.rename(columns={
        'Nombres': 'nombre',
        'Apellidos': 'apellido',
        'Teléfono (Móvil)': 'telefono_movil',
        'Correo electrónico:': 'correo_electronico',
        'Carrera': 'carrera',
        'Universidad': 'universidad',
        'Organización': 'organizacion',
        'Trabajo': 'trabajo',
        'Ocupación': 'ocupacion'
    })
    df = df.drop(["Marca temporal", "¿Desea recibir notificaciones de futuros eventos?", "¿Estás seguro de que podrás asistir al evento de forma presencial?"], axis=1)
    return df

def check_and_insert(df, table_name):
    existing_data = pd.read_sql_table(table_name, engine)
    merge_key = 'correo_electronico' if table_name == 'personas' else 'id_persona'
    # Comprobación de duplicados
    df_new = df[~df[merge_key].isin(existing_data[merge_key])]
    if not df_new.empty:
        df_new.to_sql(table_name, con=engine, if_exists='append', index=False)
        print(f"Inserted new data into {table_name}.")
    else:
        print(f"No new data to insert into {table_name}.")

data = pd.read_csv("")
data = data.drop_duplicates(subset='Correo electrónico:', keep='first')
data['id_persona'] = np.arange(len(data))
df = formatDf(data)


estudiantes = df[df['ocupacion'] == 'Estudiante'][['nombre', 'apellido', 'telefono_movil', 'correo_electronico', 'carrera', 'universidad']]
profesionales = df[df['ocupacion'] == 'Profesional'][['nombre', 'apellido', 'telefono_movil', 'correo_electronico', 'organizacion', 'trabajo']]


check_and_insert(df[['nombre', 'apellido', 'telefono_movil', 'ocupacion', 'correo_electronico']], 'personas')

df_ids = pd.read_sql("SELECT id_persona, correo_electronico FROM personas", con=engine)

estudiantes = estudiantes.merge(df_ids, on='correo_electronico')
profesionales = profesionales.merge(df_ids, on='correo_electronico')

check_and_insert(estudiantes[['id_persona', 'carrera', 'universidad']], 'estudiantes')
check_and_insert(profesionales[['id_persona', 'organizacion', 'trabajo']], 'profesionales')

if __name__ == "__main__":
    file_path = sys.argv[1]
    process_csv(file_path)
