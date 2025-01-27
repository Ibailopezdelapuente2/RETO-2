<template>
    <div class="col-md-12 mt-5">
        <div class="custom-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>Gestión de Campus</h4>
                <button class="btn btn-egibide" @click="showCreateModal = true">+ Nuevo Campus</button>
            </div>
            <ul class="list-group">
                <li v-for="(campus, index) in campuses" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ campus.name }} </strong>
                        <span class="text-muted d-block">{{ campus.status === 'habilitado' ? 'Activo' : 'Deshabilitado' }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <label class="switch me-3">
                          <div v-if="campus.status === 'habilitado'">
                            <img class="activated" src="../img/boton-de-encendido.png">
                          </div>
                          <div v-else>
                            <img class="desactivated" src="../img/interfaz.png">
                          </div>
                            <input type="checkbox" :checked="campus.status === 'habilitado'" @change="toggleStatus(campus)">
                            <span></span>
                        </label>
                        <button class="btn btn-outline-egibide btn-sm" @click="editCampus(campus)"><img class="pencil" src="../img/lapiz-de-cejas.png">Editar</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <!-- Modal para Crear Campus -->
    <div v-if="showCreateModal" class="modal-backdrop">
        <div class="modal show">
            <h2>Nuevo Campus</h2>
            <input v-model="newCampusName" type="text" class="form-control mt-5" placeholder="Nombre del campus">
            <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-egibide" @click="closeModal">Cancelar</button>
                <button type="button" class="btn btn-egibide" @click="createCampus">Guardar</button>
            </div>
        </div>
    </div>

    <!-- Modal para Editar Campus -->
    <div v-if="showEditModal" class="modal-backdrop">
        <div class="modal show">
            <h2>Editar Campus</h2>
            <input v-model="editedCampusName" type="text" class="form-control mt-5" :placeholder="editCampusObj.name">
            <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-egibide" @click="closeModal">Cancelar</button>
                <button type="button" class="btn btn-egibide" @click="saveCampusEdit">Guardar</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            campuses: [],
            showCreateModal: false,
            showEditModal: false,
            newCampusName: '',
            editedCampusName: '',
            editCampusObj: null,
        };
    },
    created() {
        this.fetchCampuses();
    },
    methods: {
        async fetchCampuses() {
            const token = sessionStorage.getItem('token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/campuses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.campuses = response.data;
            } catch (error) {
                console.error('Error al obtener los campus:', error);
            }
        },

        toggleStatus(campus) {
            campus.status = campus.status === 'habilitado' ? 'deshabilitado' : 'habilitado';
            this.updateCampusStatus(campus);
        },

        async updateCampusStatus(campus) {
            const token = sessionStorage.getItem('token');
            try {
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/auth/campuses/${campus.id}/status`,  
                    { status: campus.status },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Estado del campus actualizado:", response.data);
            } catch (error) {
                console.error("Error al actualizar el estado del campus:", error);
            }
        },

        createCampus() {
            const token = sessionStorage.getItem('token');
            const campusData = {
                name: this.newCampusName,
            };
            axios.post('http://127.0.0.1:8000/api/auth/campuses/create', campusData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                this.campuses.push(response.data.campus); // Agregar el nuevo campus a la lista
                this.closeModal(); // Cerrar el modal
                this.fetchCampuses(); //Recarga la select
            })
            .catch(error => {
                console.error('Error al crear el campus:', error);
            });
        },

        editCampus(campus) {
            this.editCampusObj = campus;
            this.editedCampusName = campus.name;
            this.showEditModal = true;
        },

        saveCampusEdit() {
            const token = sessionStorage.getItem('token');
            const campusData = {
                name: this.editedCampusName,
            };
            axios.put(`http://127.0.0.1:8000/api/auth/campuses/${this.editCampusObj.id}/edit`, campusData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                const index = this.campuses.findIndex(campus => campus.id === this.editCampusObj.id);
                if (index !== -1) {
                    this.campuses[index].name = this.editedCampusName; // Actualizar el nombre del campus en la lista
                }
                this.closeModal(); // Cerrar el modal
            })
            .catch(error => {
                console.error('Error al editar el campus:', error);
            });
        },

        closeModal() {
            this.showCreateModal = false;
            this.showEditModal = false;
            this.newCampusName = '';
            this.editedCampusName = '';
        },
    },
};
</script>

<style scoped>
/* Estilos del modal */

</style>
