
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
    atributoNoValidoParaSerAgregado: false
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
      }
    },

    verProductoRegistrado(producto){
      this.newProducto = producto;
      this.agregarNombreDeProductoExistente = true;
    },

    verProductoNuevo(){
      this.newProducto.nombreProducto = this.buscarNombreProducto;
      this.agregarNuevoNombreDeProducto = true;
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
  } // end watch

})