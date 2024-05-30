import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'


function App() {

  const baseUrl="https://localhost:44373/api/gestores";
  const [data, setData]= useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalinsertar]=useState(false);
  const [modalEliminar, setModalELiminar]=useState(false);
  const [gestorSeleccionado, setgestorSelecionado]= useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarrollador: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setgestorSelecionado({
      ...gestorSeleccionado,
      [name]: value
    })
    console.log(gestorSeleccionado);
  }

  const abrircerrarModalInsertar=()=>{
    setModalinsertar(!modalInsertar);
  }

  const abrircerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrircerrarModalEliminar=()=>{
    setModalELiminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.id;
    gestorSeleccionado.lanzamiento=parseInt(gestorSeleccionado.lanzamiento);
    await axios.post(baseUrl, gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrircerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    gestorSeleccionado.lanzamiento=parseInt(gestorSeleccionado.lanzamiento);
    await axios.put(baseUrl+"/"+gestorSeleccionado.id, gestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.id===gestorSeleccionado.id){
          gestor.nombre=respuesta.nombre;
          gestor.lanzamiento=respuesta.lanzamiento;
          gestor.desarrollador=respuesta.desarrollador;
        }
      })
      abrircerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelet=async()=>{
    await axios.delete(baseUrl+"/"+gestorSeleccionado.id)
    .then(response=>{
      setData(data.filter(gestor=>gestor.id!==response.data));
      abrircerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setgestorSelecionado(gestor);
    (caso==="Editar")?
    abrircerrarModalEditar(): abrircerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className='App'>{/*realizar nuevas peticiones y guardar en la base de datos*/}
      <br /> <br />
      <button onClick={()=>abrircerrarModalInsertar()} className='btn btn-success'>Inserta nuevo gestor</button>
      <br /> <br />
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor=>(
            <tr key={gestor.id}>
              <td>{gestor.id}</td>
              <td>{gestor.nombre}</td>
              <td>{gestor.lanzamiento}</td>
              <td>{gestor.desarrollador}</td>
              <td>
                <button className='btn btn-primary' onClick={()=>seleccionarGestor(gestor,"Editar")}>Editar</button>{" "}
                <button className='btn btn-danger' onClick={()=>seleccionarGestor(gestor,"Eliminar")}>Eliminiar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/*insertar nuevos campos*/}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Inserte un gestor de bases de datos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className='form-control' name='nombre' onChange={handleChange}/>
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className='form-control'  name='lanzamiento' onChange={handleChange}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className='form-control' name='desarrollador' onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPost()}>Insertar</button>
          <button className='btn btn-danger' onClick={()=>abrircerrarModalInsertar()}>Cnacelar</button>
        </ModalFooter>
      </Modal>
      
{/*ediccion de los complementos*/}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar un gestor de bases de datos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input type="text" className='form-control' readOnly value={gestorSeleccionado && gestorSeleccionado.id} />
            <label>Nombre: </label>
            <br />
            <input type="text" className='form-control' name='nombre' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre}/>
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className='form-control'  name='lanzamiento' onChange={handleChange}value={gestorSeleccionado && gestorSeleccionado.lanzamiento}/>
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className='form-control' name='desarrollador' onChange={handleChange}value={gestorSeleccionado && gestorSeleccionado.desarrollador}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPut()}>Editar</button>
          <button className='btn btn-danger' onClick={()=>abrircerrarModalEditar()}>Cnacelar</button>
        </ModalFooter>
      </Modal>

{/*elminar los campos correspondidos*/}
          <Modal isOpen={modalEliminar}>
            <ModalBody>
              ¿Seguro de Eliminiar el gestor seleccionado? {gestorSeleccionado && gestorSeleccionado.id}
            </ModalBody>
            <ModalFooter>
              <button className='btn btn-primary' onClick={()=>peticionDelet()}>Si</button>
              <button className='btn btn-danger' onClick={()=>abrircerrarModalEliminar()}>No</button>
            </ModalFooter>
          </Modal>
    </div>
  );
}

export default App;