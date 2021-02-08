Vue.component('TarjetaDeAtributo', {
   template: `
   <div>
      <div class="card m-2" style="width: 18rem;">
         <div class="card-body">
         <h5 class="card-title">
            <div class="row" v-if="!atributoEnEdicion">
               <div class="col">
                  <strong>{{ atributo.nombre }}</strong>
               </div>
               <div class="col text-right">
                  <a @click="atributoEnEdicion = !atributoEnEdicion" href="#" class="btn btn-outline-info btn-sm"><i class="fas fa-edit"></i></a>
                  <a @click="removeAtributo(atributo.nombre)" href="#" class="btn btn-outline-danger btn-sm"><i class="fas fa-times-circle"></i></a>
               </div>
            </div>

            <div class="row" v-else-if="atributoEnEdicion">
               <div class="col">
                  <form>
                     <div class="form-group text-center">
                     <div class="input-group mb-2">
                        <input v-model="atributo.nombre" type="text" class="form-control">
                        <div class="input-group-append">
                           <button @click="atributoEnEdicion = !atributoEnEdicion" class="input-group-text btn btn-outline-danger"><i class="fas fa-times-circle"></i></button>
                        </div>
                     </div>
                     </div>
                  </form>
               </div>
            </div>

         </h5>
         </div>
         <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(valor, pos) in atributo.valores" :key="pos">
               <div class="row">
                  <div class="col">
                  {{ valor }}
                  </div>
                  <div class="col">
                     <a href="#" class="btn btn-outline-info btn-sm"><i class="fas fa-edit"></i></a>
                     <a @click="removeValue(valor, atributo.nombre)" href="#" class="btn btn-outline-danger btn-sm"><i class="fas fa-times-circle"></i></a>
                  </div>
               </div>
            </li>
            <li class="list-group-item">
               <form>
                  <div class="form-group text-center">
                  <div class="input-group mb-2">
                     <input v-model="newValor" type="text" class="form-control" placeholder="Nuevo Valor...">
                     <div class="input-group-append">
                        <button @click="handleNewValor(atributo.nombre)" class="input-group-text btn btn-outline-success"><i class="fa fa-plus"></i></button>
                     </div>
                  </div>
                  </div>
               </form>
            </li>
         </ul>
      </div>
   </div>
   `,
   data(){
      return {
         atributoEnEdicion: false,
         newAtributo: "",
         newValor: ""
      }
   },

   props: ['atributo', 'removeAtributo'],

   methods: {
      handleNewValor(atributoNombre){
         if (this.newValor === "") {
            return;
         }

         let obj = {
            atributoNombre,
            newValor: this.newValor
         }
         this.$emit('new-valor', obj);
         this.newValor = "";
      },

      removeValue(value, atributo){
         let obj = {
            value,
            atributo
         }
         this.$emit('remove-valor', obj);
      }
   } // end Methods
})








const appVue = new Vue({
   el: '#appVue',
   data: {
      registroDePlantillas: [
         {
            nombreProducto: 'Pestaña',
            atributos: [
               {
                  nombre: 'Medida',
                  valores: ['0.05', '0.07', '0.20']
               },
               {
                  nombre: 'Color',
                  valores: ['Rojo', 'Negro', 'Transparente']
               }
            ],
         }
      ],

      buscarNombreProducto: "",

      newProducto: {
         nombreProducto: '',
         atributos: []
      },

      newAtributo: {
         nombre: '',
         valores: []
      },

      atributoEnModoEdicion: false,

      productoEnRegistroDePlantillas: false,
      nombreDeProductosRegistrados: [],
      agregarNuevoNombreDeProducto: false,
      agregarNombreDeProductoExistente: false,
      atributoNoValidoParaSerAgregado: false,

      formCompra: {
         productoSeleccionadoParaComprar: "",
         cantidadItemsEnCompra: null,
         montoTotalPagado: null,
      },

   },

   methods: {
      findProduct() {
         if (this.buscarNombreProducto.length > 2) {
            let existe = false;
            let nombres = [];
            this.registroDePlantillas.map(producto => {
               if ( ( producto.nombreProducto.toLowerCase() ).includes( (this.buscarNombreProducto).toLowerCase() ) ) {
                  existe = true;
                  nombres.push(producto);
               }
            })
            this.nombreDeProductosRegistrados = nombres;
            this.productoEnRegistroDePlantillas = existe;
         } else {
            this.productoEnRegistroDePlantillas = false;
            this.agregarNuevoNombreDeProducto = false;
            this.agregarNombreDeProductoExistente = false;
            this.newProducto = {
               nombreProducto: '',
               atributos: []
            };
         }
      },

      verProductoRegistrado(producto){
         this.newProducto = producto;
         this.agregarNombreDeProductoExistente = true;
      },

      verProductoNuevo(){
         this.newProducto.nombreProducto = this.buscarNombreProducto;
         this.agregarNuevoNombreDeProducto = true;
         this.registroDePlantillas.push(this.newProducto);
      },

      handleNewAtributo(){
         if (this.newAtributo.nombre === "") {
            return;
         }

         if ( this.atributoValido(this.newAtributo.nombre) ) {
            this.addNewAtributoValido(this.newAtributo.nombre); 
         } else {
            this.atributoNoValidoParaSerAgregado = true;
            setTimeout(() => {
               this.atributoNoValidoParaSerAgregado = false;
            }, 3000);
         }
      },

      atributoValido(nombre){
         for (let i = 0; i < this.newProducto.atributos.length; i++) {
            if (this.newProducto.atributos[i].nombre === nombre) {
               return false;
            }
         }
         return true;
      },

      addNewAtributoValido(nombre){
         this.newProducto.atributos.push({
            nombre: nombre,
            valores: []
         });
         this.newAtributo.nombre = "";
      },

      removeAtributo(name){
         this.newProducto.atributos = this.newProducto.atributos.filter(atributo => atributo.nombre !== name);
      },

      handleNewValor(request){
         this.newProducto.atributos.map(atributo => {
            if (atributo.nombre === request.atributoNombre) {
               atributo.valores.push(request.newValor);
            }
         })
      },

      removeIncomingValue(request){
         this.newProducto.atributos.map(atributo => {
            if (atributo.nombre === request.atributo) {
               atributo.valores = atributo.valores.filter(valor => valor !== request.value)
            }
         })
      },

      removeProductNameRegistered(nombre){
         this.registroDePlantillas = this.registroDePlantillas.filter(producto => producto.nombreProducto !== nombre);
         this.nombreDeProductosRegistrados = this.nombreDeProductosRegistrados.filter(producto => producto.nombreProducto !== nombre);
         this.newProducto = {
            nombreProducto: '',
            atributos: []
         };
         this.agregarNombreDeProductoExistente = false;
      },

      validarComprarRealizada(){
         let response = false;
         if (condition) {
            
         }
         return response;
      },

      handleCompraRealizada(){
         console.log(this.formCompra);
      }
   }, // end methods


   watch: {
      newProducto: function(newVal) {
         this.registroDePlantillas = this.registroDePlantillas.map(producto => {
            if (producto.nombreProducto === this.newProducto.nombreProducto) {
               return newVal;
            }
            return producto;
         })
      }
   }, // end watch

   computed: {
      atributosAMostrar(){
         let response = [];
         if (this.formCompra.productoSeleccionadoParaComprar === "") {
            return [];
         }
         let producto = this.registroDePlantillas.filter(producto => producto.nombreProducto === this.formCompra.productoSeleccionadoParaComprar);
         response = producto.map(producto => producto.atributos);
         return response[0];
      },

      costoUnitario(){
         let response = null;
         if ( this.formCompra.cantidadItemsEnCompra !== null && this.formCompra.montoTotalPagado !== null ) {
            response = ( parseFloat(this.formCompra.montoTotalPagado) / parseFloat(this.formCompra.cantidadItemsEnCompra) ).toFixed(2);
         }
         return response;
      }
   }

})