import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import db from './sqlite/SQLiteDB'
import { IAluno , IMateria} from './models/models';
import Aluno from './sqlite/Aluno';
import Materia from './sqlite/Materia';
import Matricula from './sqlite/Matricula';

export default function App() {

  const printAluno = (aluno:IAluno) => {
    Aluno.getMaterias(aluno.aluno_id!)
      .then( (materias:IMateria[]) => {
        const materiasArr:string[] = []
        materias.forEach( materia => materiasArr.push(materia.abreviatura))
        if(materiasArr.length !== 0){
          console.log(`${aluno.nome}  [${aluno.aluno_id}] /  Materias: ${materiasArr}`)  
        }
        else{
          console.log(`${aluno.nome}  [${aluno.aluno_id}] /  Materias: 0`)  
        }
      })
      .catch(err =>console.log(err))
  }

  const printMaterias = (materia:IMateria) => {
    Materia.getAlunos(materia.materia_id!)
      .then( (alunos:IAluno[]) => {
        console.log('\n')
        console.log(`${materia.nome} [${materia.abreviatura}] / Matriculados: ${alunos.length} \n`)
        alunos.forEach(
          aluno => console.log(`[${aluno.aluno_id}] ${aluno.nome}`)
        )

      })
      .catch(err =>console.log(err))
  }

  const dropAllTables = () => { 
    Aluno.dropAlunoTable()
    Materia.dropMateriaTable()
    Matricula.dropMatriculasTable()
  }
  const carregarApp = () => { 
    console.log('===================================')
    dropAllTables()
    Aluno.createAlunoTable()
    Materia.createMateriaTable()
    Matricula.createMatriculaTable()

    Aluno.create({nome:'Fulano da Silva'})
      .then(id=> console.log('Criado aluno nº ' + id))
      .catch(err =>console.log(err))

    Aluno.create({nome:'Beltrano dos Santos'})
      .then(id=>console.log('Criado aluno nº ' + id))
      .catch(err=> console.log(err))

    Materia.create({nome: 'Matemática', abreviatura:'MAT'})
      .then(id=>console.log('Criada matéria nº ' +id))
      .catch(err=>console.log(err))

    Materia.create({nome: 'Português', abreviatura:'PORT'})
      .then(id=>console.log('Criada matéria nº: ' +id))
      .catch(err=>console.log(err))

    Matricula.efetuar( 1,  1)
      .then(id => true )
      .catch(err=>console.log(err))

    Matricula.efetuar( 2,  1)
      .then(id => true )
      .catch(err=>console.log(err))
      
    Matricula.efetuar( 1,  2)
      .then(id => true )
      .catch(err=>console.log(err))

    Aluno.all()
      .then( alunos => alunos.forEach( a => printAluno(a) ))

    Materia.all()
      .then( materias => materias.forEach( m => printMaterias(m)))
      .catch(err=>console.log(err))
/*
    Aluno.remove(1)
      .then( updated => console.log('Aluno removido: ' + updated))
      .catch( err => console.log(err))

    Aluno.remove(2)
      .then( updated => console.log('Aluno removido: ' + updated))
      .catch( err => console.log(err))
    
    Materia.remove(1)
      .then( updated => console.log('Materias removidas: ' +updated))
      .catch( err=>console.log(err))

    Aluno.all()
      .then( alunos => console.log(alunos))
*/
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.carregar_btn} onPress={()=>carregarApp()} >
        <Text style={styles.texto}>CARREGAR</Text>
      </TouchableOpacity>

      {/*
      <TouchableOpacity style={styles.carregar_btn} onPress={()=>dropAllTables()} >
        <Text style={styles.texto}>DERRUBAR TABELAS</Text>
      </TouchableOpacity>
      */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carregar_btn:{
    backgroundColor: 'blue',    
    padding: 8,
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1
  },
  texto:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
 }
});
