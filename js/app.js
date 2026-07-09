const DemoApp = {
  init() {
    if (!localStorage.getItem('demo_initialized')) {
      this.seedData();
    }
  },

  seedData() {
    const usuarios = [
      { usuario: 'admin', contrasena: 'admin123' }
    ];

    const categorias = [
      { cod_categoria: 'CT001', nombre_categorias: 'Medicamentos', desc_categ: 'Medicamentos de venta libre y recetados' },
      { cod_categoria: 'CT002', nombre_categorias: 'Cuidado Personal', desc_categ: 'Productos de higiene y cuidado personal' },
      { cod_categoria: 'CT003', nombre_categorias: 'Vitaminas', desc_categ: 'Suplementos vitamínicos y minerales' },
      { cod_categoria: 'CT004', nombre_categorias: 'Primeros Auxilios', desc_categ: 'Equipo y suministros para emergencias' }
    ];

    const proveedores = [
      { cod_proveedor: 'PR001', nombre_prov: "Farmac\xE9utica Nacional S.A.", direccion: 'Av. Central 123, Col. Centro', telefono: '2212-3456', nombreContacto: 'Carlos L\xF3pez', correo: 'carlos@farnac.com', comentarios: 'Proveedor principal' },
      { cod_proveedor: 'PR002', nombre_prov: 'Distribuidora M\xE9dica Express', direccion: 'Blvd. Norte 456, Col. Industrial', telefono: '2267-8901', nombreContacto: 'Mar\xEDa Garc\xEDa', correo: 'maria@dme.com', comentarios: 'Entrega r\xE1pida' },
      { cod_proveedor: 'PR003', nombre_prov: 'Laboratorios FarmaPlus', direccion: 'Calle Sur 789, Col. Jard\xEDn', telefono: '2234-5678', nombreContacto: 'Juan P\xE9rez', correo: 'juan@farmaplus.com', comentarios: '' }
    ];

    const productos = [
      { cod_producto: 'PD001', cod_proveedor: 'PR001', cod_categoria: 'CT001', nombre_producto: 'Paracetamol 500mg', desc_prod: 'Analg\xE9sico y antipir\xE9tico', cantidad_prod: 150, precio: 25.50, estado: 1 },
      { cod_producto: 'PD002', cod_proveedor: 'PR001', cod_categoria: 'CT001', nombre_producto: 'Ibuprofeno 400mg', desc_prod: 'Antiinflamatorio no esteroideo', cantidad_prod: 100, precio: 35.00, estado: 1 },
      { cod_producto: 'PD003', cod_proveedor: 'PR002', cod_categoria: 'CT003', nombre_producto: 'Vitamina C 1000mg', desc_prod: 'Suplemento de vitamina C efervescente', cantidad_prod: 200, precio: 45.00, estado: 1 },
      { cod_producto: 'PD004', cod_proveedor: 'PR002', cod_categoria: 'CT002', nombre_producto: 'Protector Solar SPF50', desc_prod: 'Protector solar resistente al agua', cantidad_prod: 80, precio: 120.00, estado: 1 },
      { cod_producto: 'PD005', cod_proveedor: 'PR003', cod_categoria: 'CT004', nombre_producto: 'Vendas El\xE1sticas 5cm', desc_prod: 'Vendas de algod\xF3n el\xE1stico 5cm x 4.5m', cantidad_prod: 300, precio: 15.75, estado: 1 },
      { cod_producto: 'PD006', cod_proveedor: 'PR003', cod_categoria: 'CT001', nombre_producto: 'Amoxicilina 500mg', desc_prod: 'Antibi\xF3tico de amplio espectro', cantidad_prod: 0, precio: 55.00, estado: 0 }
    ];

    localStorage.setItem('demo_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('demo_categorias', JSON.stringify(categorias));
    localStorage.setItem('demo_productos', JSON.stringify(productos));
    localStorage.setItem('demo_proveedores', JSON.stringify(proveedores));
    localStorage.setItem('demo_initialized', 'true');
  },

  isAuthenticated() { return localStorage.getItem('demo_autenticado') === 'true'; },

  requireAuth() { if (!this.isAuthenticated()) { window.location.href = 'login.html'; } },

  redirectIfAuth() { if (this.isAuthenticated()) { window.location.href = 'dashboard.html'; } },

  getCurrentUser() { return localStorage.getItem('demo_usuario'); },

  login(usuario, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('demo_usuarios') || '[]');
    const user = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (user) {
      localStorage.setItem('demo_autenticado', 'true');
      localStorage.setItem('demo_usuario', usuario);
      return { success: true };
    }
    return { success: false, mensaje: 'Usuario o contrase\xF1a incorrectos' };
  },

  logout() {
    localStorage.removeItem('demo_autenticado');
    localStorage.removeItem('demo_usuario');
    window.location.href = 'login.html';
  },

  getCategorias() { return JSON.parse(localStorage.getItem('demo_categorias') || '[]'); },
  getCategoria(cod) { return this.getCategorias().find(c => c.cod_categoria === cod) || null; },

  crearCategoria(data) {
    const cats = this.getCategorias();
    if (cats.find(c => c.cod_categoria === data.cod_categoria)) return { success: false, mensaje: 'ya existe' };
    cats.push(data);
    localStorage.setItem('demo_categorias', JSON.stringify(cats));
    return { success: true };
  },

  actualizarCategoria(cod, data) {
    const cats = this.getCategorias();
    const idx = cats.findIndex(c => c.cod_categoria === cod);
    if (idx === -1) return { success: false, mensaje: 'No encontrada' };
    cats[idx] = { ...cats[idx], ...data };
    localStorage.setItem('demo_categorias', JSON.stringify(cats));
    return { success: true };
  },

  eliminarCategoria(cod) {
    const cats = this.getCategorias();
    const productos = this.getProductos();
    if (productos.some(p => p.cod_categoria === cod)) return { success: false, mensaje: 'No se puede eliminar la categor\xEDa porque tiene productos asociados' };
    const filtered = cats.filter(c => c.cod_categoria !== cod);
    if (filtered.length === cats.length) return { success: false, mensaje: 'No encontrada' };
    localStorage.setItem('demo_categorias', JSON.stringify(filtered));
    return { success: true };
  },

  getProductos() { return JSON.parse(localStorage.getItem('demo_productos') || '[]'); },
  getProducto(cod) { return this.getProductos().find(p => p.cod_producto === cod) || null; },
  getProductosPorEstado(estado) { return this.getProductos().filter(p => p.estado == estado); },

  crearProducto(data) {
    const prods = this.getProductos();
    if (prods.find(p => p.cod_producto === data.cod_producto)) return { success: false, mensaje: 'ya existe' };
    prods.push(data);
    localStorage.setItem('demo_productos', JSON.stringify(prods));
    return { success: true };
  },

  actualizarProducto(cod, data) {
    const prods = this.getProductos();
    const idx = prods.findIndex(p => p.cod_producto === cod);
    if (idx === -1) return { success: false, mensaje: 'No encontrado' };
    prods[idx] = { ...prods[idx], ...data };
    localStorage.setItem('demo_productos', JSON.stringify(prods));
    return { success: true };
  },

  eliminarProducto(cod) {
    const prods = this.getProductos();
    const filtered = prods.filter(p => p.cod_producto !== cod);
    if (filtered.length === prods.length) return { success: false, mensaje: 'No encontrado' };
    localStorage.setItem('demo_productos', JSON.stringify(filtered));
    return { success: true };
  },

  getProveedores() { return JSON.parse(localStorage.getItem('demo_proveedores') || '[]'); },
  getProveedor(cod) { return this.getProveedores().find(p => p.cod_proveedor === cod) || null; },

  crearProveedor(data) {
    const provs = this.getProveedores();
    if (provs.find(p => p.cod_proveedor === data.cod_proveedor)) return { success: false, mensaje: 'ya existe' };
    provs.push(data);
    localStorage.setItem('demo_proveedores', JSON.stringify(provs));
    return { success: true };
  },

  actualizarProveedor(cod, data) {
    const provs = this.getProveedores();
    const idx = provs.findIndex(p => p.cod_proveedor === cod);
    if (idx === -1) return { success: false, mensaje: 'No encontrado' };
    provs[idx] = { ...provs[idx], ...data };
    localStorage.setItem('demo_proveedores', JSON.stringify(provs));
    return { success: true };
  },

  getUsuario(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('demo_usuarios') || '[]');
    return usuarios.find(u => u.usuario === usuario) || null;
  },

  crearUsuario(data) {
    const usuarios = JSON.parse(localStorage.getItem('demo_usuarios') || '[]');
    if (usuarios.find(u => u.usuario === data.usuario)) return { success: false, mensaje: 'El usuario ya existe' };
    usuarios.push(data);
    localStorage.setItem('demo_usuarios', JSON.stringify(usuarios));
    return { success: true };
  },

  restablecerContrasena(usuario, contrasena_nueva) {
    const usuarios = JSON.parse(localStorage.getItem('demo_usuarios') || '[]');
    const idx = usuarios.findIndex(u => u.usuario === usuario);
    if (idx === -1) return { success: false, mensaje: 'Usuario no encontrado' };
    usuarios[idx].contrasena = contrasena_nueva;
    localStorage.setItem('demo_usuarios', JSON.stringify(usuarios));
    return { success: true };
  },

  showToast(icon, title, text) {
    Swal.fire({ icon, title, text, showConfirmButton: false, timer: 3000, timerProgressBar: true, toast: true, position: 'top-end', customClass: { popup: 'colored-toast' } });
  },

  showAlert(icon, title, text) {
    const colors = { success: '#0d6efd', error: '#d33', warning: '#ffc107', info: '#0dcaf0' };
    Swal.fire({ icon, title, text, confirmButtonColor: colors[icon] || '#0d6efd' });
  },

  async confirmDelete(mensaje = '!\xA1No podr\xE1s revertir esta acci\xF3n!') {
    const result = await Swal.fire({
      title: '\xBFEst\xE1s seguro?', text: mensaje, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#6c757d',
      confirmButtonText: 'S\xED, eliminar', cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }
};

DemoApp.init();
