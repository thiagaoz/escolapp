import db from './SQLiteDB'
import {IMateria, IAluno} from '../models/models'
import { SQLError, SQLResultSetRowList } from 'expo-sqlite';

const createMatriculaTable = () : Promise<void>=> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        const query = 'CREATE TABLE IF NOT EXISTS matriculas (matricula_id INTEGER PRIMARY KEY AUTOINCREMENT, '+
        'aluno_id INTEGER, materia_id  INTEGER, '+
        'FOREIGN KEY (aluno_id) REFERENCES alunos(aluno_id), '+
        'FOREIGN KEY (materia_id) REFERENCES materias(materia_id));'
        tx.executeSql(
          query,
          [],
          () => {
            console.log(' --- TABELA MATRICULAS CRIADA ---');
            resolve();
          },
          (_: any, error: SQLError) => {
            // Handle the error
            console.error('SQL Erro criando TABLE:', error);
            return true; // Rollback the transaction
        }
        );
      });
    });
  };

const efetuar = (aluno_id:number, materia_id:number) => { 
    return new Promise ((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO matriculas (aluno_id, materia_id) VALUES (?,?);',
            [aluno_id, materia_id],
            //-------------------------
            (tx, result) => {
                const { rowsAffected, insertId } = result;
                if (rowsAffected > 0) {
                    resolve(insertId as number);
                } else {
                    reject(new Error('Erro ao realizar matricula do aluno ID:' +aluno_id+ ' na matéria ID: '+materia_id));
                }
            },
            (_: any, error: SQLError) => {
                // Handle the error
                console.error('SQL Error adicionando materia:', error);
                return true; // Rollback the transaction
            }
        )
        })
    })
}

const dropMatriculasTable = () => { 
    db.transaction((tx) => {
        tx.executeSql('DROP TABLE matriculas;');
        console.log(' --- TABELAS MATRÍCULAS DELETADA ---')
      })
}

export default {
    createMatriculaTable, 
    efetuar,
    dropMatriculasTable
}