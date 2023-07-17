import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useChilds } from '../childcomponents/useChilds';
import {  getListChilds } from '../../api';


function ChildList() {
    const { childs, setChilds } = useChilds();

    useEffect(() => {
        // Supongamos que tienes una función fetchChilds que obtiene la lista de niños desde la API
        const fetchChilds = async () => {
          const token = localStorage.getItem("token");
          const data = await getListChilds(token);
          setChilds(data.data);
        };
    
        fetchChilds();
      }, [setChilds]);
    
      useEffect(() => {
      }, [childs]);

      if (!Array.isArray(childs)) {
        return <div>Loading...</div>; // Agregar un estado de carga mientras se obtiene la lista de niños
      }
    const handleUpdate = (childId) => {
        // Tu lógica para manejar la actualización
    }

    const handleDelete = (childId) => {
        // Tu lógica para manejar el borrado
    }

    return (
        <div className="container">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Child Name</th>
                    <th>Age</th>
                    <th>Childcare</th>
                    {/* <th>Actions</th> */}
                </tr>
            </thead>
            <tbody>
                {childs.map((child) => (
                    <tr key={child._id}>
                        <td>{child.child_name}</td>
                        <td>{child.age}</td>
                        <td>{child.childcare}</td>
                        {/* <td>
                            <Button variant="info" onClick={() => handleUpdate(child._id)}>Update</Button>
                            {' '}<Button variant="danger" onClick={() => handleDelete(child._id)}>Delete</Button>
                        </td> */}
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
    );
}

export default ChildList;
