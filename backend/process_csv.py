import pandas as pd
import sys

def process_csv(file_path):
    df = pd.read_csv(file_path)
    columns = df.columns.tolist()
    print(','.join(columns))

if __name__ == "__main__":
    file_path = sys.argv[1]
    process_csv(file_path)
