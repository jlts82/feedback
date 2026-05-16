
        // ============================================================
        // SUPABASE_MIGRATION: ESTRUCTURA DE DATOS NORMALIZADA
        // ============================================================
        // Esta estructura separa claramente insumos (supplies) de productos (products)
        // y prepara el terreno para migración a PostgreSQL/Supabase.
        // 
        // Tablas propuestas para Supabase:
        // 1. supplies (id, name, description, unit, cost, min_stock, supplier_id, created_at)
        // 2. products (id, name, description, sku, base_price, stock, min_stock, category_id)
        // 3. categories (id, name, type, parent_id, color_code) - type: 'supply' | 'product'
        // 4. supply_categories (supply_id, category_id)
        // 5. product_categories (product_id, category_id)
        // 6. inventory_movements (id, item_type, item_id, movement_type, quantity, reason, created_at)
        //    - item_type: 'supply' | 'product'
        //    - movement_type: 'in' | 'out' | 'adjustment'
        //
        // Relaciones:
        // - supplies.supplier_id -> suppliers.id
        // - products.category_id -> categories.id
        // - categories.parent_id -> categories.id (self-referencial para subcategorías)
        // ============================================================

        // Data Store - Estructura migrada y normalizada
        const store = {
            orders: [],
            quotes: [],
            
            // ============================================================
            // NUEVO: Inventario separado en Supplies (Insumos) y Products (Productos)
            // ============================================================
            
            // SUPPLIES: Insumos de producción (no se venden directamente al cliente)
            // En Supabase: tabla 'supplies' con categorías vía tabla pivote
            supplies: [
                // Categoría: Tintas DTF
                { 
                    id: 'sup_1', 
                    name: 'Tinta DTF Blanca', 
                    description: 'Tinta base blanca para impresión DTF',
                    category: 'tintas_dtf',
                    subcategory: 'base_blanca',
                    type: 'supply', // 'supply' | 'product'
                    stock: 5, 
                    minStock: 2, 
                    unit: 'litro', 
                    cost: 450, 
                    supplier: 'Proveedor A',
                    location: 'Estante A1',
                    lastRestocked: '2026-03-20'
                },
                { 
                    id: 'sup_2', 
                    name: 'Tinta DTF Cyan', 
                    description: 'Tinta cyan para sistema CMYK',
                    category: 'tintas_dtf',
                    subcategory: 'cmyk',
                    type: 'supply',
                    stock: 3, 
                    minStock: 1, 
                    unit: 'litro', 
                    cost: 380, 
                    supplier: 'Proveedor A',
                    location: 'Estante A2',
                    lastRestocked: '2026-03-15'
                },
                { 
                    id: 'sup_3', 
                    name: 'Tinta DTF Magenta', 
                    description: 'Tinta magenta para sistema CMYK',
                    category: 'tintas_dtf',
                    subcategory: 'cmyk',
                    type: 'supply',
                    stock: 3, 
                    minStock: 1, 
                    unit: 'litro', 
                    cost: 380, 
                    supplier: 'Proveedor A',
                    location: 'Estante A2',
                    lastRestocked: '2026-03-15'
                },
                { 
                    id: 'sup_4', 
                    name: 'Tinta DTF Amarilla', 
                    description: 'Tinta amarilla para sistema CMYK',
                    category: 'tintas_dtf',
                    subcategory: 'cmyk',
                    type: 'supply',
                    stock: 4, 
                    minStock: 1, 
                    unit: 'litro', 
                    cost: 380, 
                    supplier: 'Proveedor A',
                    location: 'Estante A2',
                    lastRestocked: '2026-03-15'
                },
                { 
                    id: 'sup_5', 
                    name: 'Tinta DTF Negro', 
                    description: 'Tinta negra para sistema CMYK',
                    category: 'tintas_dtf',
                    subcategory: 'cmyk',
                    type: 'supply',
                    stock: 4, 
                    minStock: 1, 
                    unit: 'litro', 
                    cost: 380, 
                    supplier: 'Proveedor A',
                    location: 'Estante A2',
                    lastRestocked: '2026-03-15'
                },
                
                // Categoría: Materiales de Impresión
                { 
                    id: 'sup_6', 
                    name: 'Película DTF 30cm', 
                    description: 'Rollo de película PET para transferencia',
                    category: 'materiales_impresion',
                    subcategory: 'peliculas',
                    type: 'supply',
                    stock: 20, 
                    minStock: 5, 
                    unit: 'metro', 
                    cost: 25, 
                    supplier: 'Proveedor B',
                    location: 'Estante B1',
                    lastRestocked: '2026-03-10'
                },
                { 
                    id: 'sup_7', 
                    name: 'Polvo Adhesivo', 
                    description: 'Polvo termoadhesivo para transferencia',
                    category: 'materiales_impresion',
                    subcategory: 'adhesivos',
                    type: 'supply',
                    stock: 2, 
                    minStock: 1, 
                    unit: 'kg', 
                    cost: 280, 
                    supplier: 'Proveedor B',
                    location: 'Estante B2',
                    lastRestocked: '2026-03-05'
                },
                
                // Categoría: Mantenimiento
                {
                    id: 'sup_8',
                    name: 'Liquido de Limpieza Cabezal',
                    description: 'Solución para mantenimiento de cabezales',
                    category: 'mantenimiento',
                    subcategory: 'limpieza',
                    type: 'supply',
                    stock: 3,
                    minStock: 1,
                    unit: 'litro',
                    cost: 120,
                    supplier: 'Proveedor A',
                    location: 'Estante C1',
                    lastRestocked: '2026-02-28'
                }
            ],
            
            // PRODUCTS: Productos terminados (se venden al cliente)
            // En Supabase: tabla 'products' con categorías vía tabla pivote
            products: [
                // Categoría: Playeras
                { 
                    id: 'prod_1', 
                    name: 'Playera Algodón Blanca M', 
                    description: 'Playera 100% algodón, corte regular',
                    category: 'playeras',
                    subcategory: 'algodon',
                    type: 'product',
                    sku: 'PLY-ALG-BLA-M',
                    stock: 50, 
                    minStock: 10, 
                    unit: 'pieza', 
                    cost: 45,
                    salePrice: 90,
                    supplier: 'Mayorista Textil',
                    location: 'Rack P1',
                    sizes: ['CH', 'M', 'G', 'XG'],
                    colors: ['Blanco', 'Negro', 'Gris']
                },
                { 
                    id: 'prod_2', 
                    name: 'Playera Algodón Negra M', 
                    description: 'Playera 100% algodón, corte regular',
                    category: 'playeras',
                    subcategory: 'algodon',
                    type: 'product',
                    sku: 'PLY-ALG-NEG-M',
                    stock: 30, 
                    minStock: 10, 
                    unit: 'pieza', 
                    cost: 48,
                    salePrice: 95,
                    supplier: 'Mayorista Textil',
                    location: 'Rack P1',
                    sizes: ['CH', 'M', 'G', 'XG'],
                    colors: ['Negro']
                },
                { 
                    id: 'prod_3', 
                    name: 'Playera Dry Fit Deportiva', 
                    description: 'Tela técnica deportiva, absorción rápida',
                    category: 'playeras',
                    subcategory: 'deportiva',
                    type: 'product',
                    sku: 'PLY-DRF-AZU-M',
                    stock: 25, 
                    minStock: 8, 
                    unit: 'pieza', 
                    cost: 65,
                    salePrice: 130,
                    supplier: 'Deportes Mayorista',
                    location: 'Rack P2',
                    sizes: ['CH', 'M', 'G', 'XG'],
                    colors: ['Azul', 'Negro', 'Rojo']
                },
                
                // Categoría: Accesorios Textiles
                { 
                    id: 'prod_4', 
                    name: 'Gorra Trucker', 
                    description: 'Gorra estilo trucker con malla trasera',
                    category: 'accesorios',
                    subcategory: 'gorras',
                    type: 'product',
                    sku: 'GOR-TRK-BLA',
                    stock: 15, 
                    minStock: 5, 
                    unit: 'pieza', 
                    cost: 35,
                    salePrice: 70,
                    supplier: 'Mayorista Textil',
                    location: 'Rack A1',
                    colors: ['Blanco', 'Negro', 'Rojo', 'Azul']
                },
                { 
                    id: 'prod_5', 
                    name: 'Gorra Snapback', 
                    description: 'Gorra snapback lisa para bordado/impresión',
                    category: 'accesorios',
                    subcategory: 'gorras',
                    type: 'product',
                    sku: 'GOR-SNP-NEG',
                    stock: 12, 
                    minStock: 4, 
                    unit: 'pieza', 
                    cost: 42,
                    salePrice: 85,
                    supplier: 'Mayorista Textil',
                    location: 'Rack A1',
                    colors: ['Negro', 'Blanco']
                },
                
                // Categoría: Textiles Especiales
                {
                    id: 'prod_6',
                    name: 'Sudadera Hoodie Premium',
                    description: 'Hoodie grueso, interior afelpado',
                    category: 'sudaderas',
                    subcategory: 'hoodies',
                    type: 'product',
                    sku: 'SUD-HOD-GRS-M',
                    stock: 8,
                    minStock: 3,
                    unit: 'pieza',
                    cost: 120,
                    salePrice: 240,
                    supplier: 'Textiles Premium',
                    location: 'Rack P3',
                    sizes: ['CH', 'M', 'G', 'XG'],
                    colors: ['Gris', 'Negro', 'Azul Marino']
                }
            ],
            
            // NUEVO: Definición de categorías jerárquicas
            // En Supabase: tabla 'categories' con self-reference (parent_id)
            categories: {
                // Categorías de Insumos
                supplies: {
                    tintas_dtf: {
                        name: 'Tintas DTF',
                        color: '#8b5cf6', // violet
                        subcategories: {
                            base_blanca: 'Tinta Base Blanca',
                            cmyk: 'Tintas CMYK',
                            fluorescente: 'Tintas Fluorescentes'
                        }
                    },
                    materiales_impresion: {
                        name: 'Materiales de Impresión',
                        color: '#06b6d4', // cyan
                        subcategories: {
                            peliculas: 'Películas PET',
                            adhesivos: 'Polvos Adhesivos',
                            papeles: 'Papeles de Sublimación'
                        }
                    },
                    mantenimiento: {
                        name: 'Mantenimiento',
                        color: '#64748b', // slate
                        subcategories: {
                            limpieza: 'Líquidos de Limpieza',
                            repuestos: 'Repuestos y Partes'
                        }
                    }
                },
                // Categorías de Productos
                products: {
                    playeras: {
                        name: 'Playeras',
                        color: '#3b82f6', // blue
                        subcategories: {
                            algodon: '100% Algodón',
                            deportiva: 'Dry Fit / Deportiva',
                            poliester: 'Poliéster',
                            mezcla: 'Mezclas'
                        }
                    },
                    sudaderas: {
                        name: 'Sudaderas',
                        color: '#f59e0b', // amber
                        subcategories: {
                            hoodies: 'Hoodies / Capucha',
                            crewneck: 'Cuello Redondo',
                            zipup: 'Cierre Completo'
                        }
                    },
                    accesorios: {
                        name: 'Accesorios',
                        color: '#10b981', // emerald
                        subcategories: {
                            gorras: 'Gorras',
                            bolsas: 'Bolsas y Mochilas',
                            termos: 'Termos y Vasos'
                        }
                    }
                }
            },
            
            // LEGACY: Mantener inventory para compatibilidad durante transición
            // En producción con Supabase, esto se eliminaría
            inventory: [],
            
            clients: [
                { 
                    id: 'cli_1', 
                    name: 'Juan Pérez', 
                    phone: '555-0101', 
                    phone2: '',
                    email: 'juan@email.com', 
                    type: 'menudeo', 
                    discount: 0, 
                    designs: [],
                    rfc: '',
                    regimenFiscal: '',
                    usoCFDI: '',
                    address: {
                        street: '',
                        colonia: '',
                        cp: '',
                        city: '',
                        state: '',
                        referencias: ''
                    },
                    notes: ''
                },
                { 
                    id: 'cli_2', 
                    name: 'Deportes Extreme', 
                    phone: '555-0202',
                    phone2: '555-0203', 
                    email: 'ventas@extreme.com', 
                    type: 'mayoreo', 
                    discount: 15, 
                    designs: [],
                    rfc: 'DEX123456ABC',
                    regimenFiscal: '601',
                    usoCFDI: 'G03',
                    address: {
                        street: 'Av. Deportiva 123',
                        colonia: 'Centro',
                        cp: '01000',
                        city: 'Ciudad de México',
                        state: 'CMX',
                        referencias: 'Edificio azul, piso 3'
                    },
                    notes: 'Cliente corporativo, pago a 30 días'
                },
                { 
                    id: 'cli_3', 
                    name: 'Eventos Corp', 
                    phone: '555-0303', 
                    phone2: '',
                    email: 'hola@eventos.com', 
                    type: 'frecuente', 
                    discount: 10, 
                    designs: [],
                    rfc: 'EVC987654XYZ',
                    regimenFiscal: '601',
                    usoCFDI: 'G03',
                    address: {
                        street: 'Calle Eventos 456',
                        colonia: 'Roma Norte',
                        cp: '06700',
                        city: 'Ciudad de México',
                        state: 'CMX',
                        referencias: ''
                    },
                    notes: ''
                }
            ],
            invoices: [],
            finanzas: [],
            designs: [],
            config: {
                prices: {
                    basePrice: 80,
                    colorMultiplier: 1.2,
                    sizeMultiplier: { small: 0.8, medium: 1, large: 1.3, xlarge: 1.5 },
                    volumeDiscount: { 10: 5, 50: 15, 100: 25 }
                }
            }
        };

        // ============================================================
        // SUPABASE_MIGRATION: ADAPTADOR DE BASE DE DATOS
        // ============================================================
        // Esta clase facilita la transición de LocalStorage a Supabase
        // sin cambiar la interfaz del resto de la aplicación.
        // ============================================================
        
        class DatabaseAdapter {
            constructor() {
                this.mode = 'localstorage'; // 'localstorage' | 'supabase'
                this.supabase = null; // Se inicializará cuando se configure
            }
            
            // Método para cambiar a modo Supabase
            async connectToSupabase(supabaseUrl, supabaseKey) {
                // Aquí se cargaría el cliente de Supabase
                // const { createClient } = require('@supabase/supabase-js');
                // this.supabase = createClient(supabaseUrl, supabaseKey);
                // this.mode = 'supabase';
                console.log('Modo Supabase no implementado aún');
            }
            
            // Obtener todos los items de inventario (unifica supplies + products)
            async getInventoryItems(type = null) {
                if (this.mode === 'supabase') {
                    if (type === 'supplies') {
                        const { data } = await this.supabase.from('supplies').select('*, categories(*)');
                        return data;
                    } else if (type === 'products') {
                        const { data } = await this.supabase.from('products').select('*, categories(*)');
                        return data;
                    } else {
                        // Unir ambos para vista general (legacy)
                        const { data: supplies } = await this.supabase.from('supplies').select('*');
                        const { data: products } = await this.supabase.from('products').select('*');
                        return [...supplies, ...products];
                    }
                } else {
                    // Modo LocalStorage
                    if (type === 'supplies') return store.supplies;
                    if (type === 'products') return store.products;
                    return [...store.supplies, ...store.products];
                }
            }
            
            // Guardar item (determina automáticamente si es supply o product)
            async saveItem(item) {
                if (this.mode === 'supabase') {
                    const table = item.type === 'supply' ? 'supplies' : 'products';
                    const { data, error } = await this.supabase.from(table).upsert(item);
                    if (error) throw error;
                    return data;
                } else {
                    const storeKey = item.type === 'supply' ? 'supplies' : 'products';
                    const existingIndex = store[storeKey].findIndex(i => i.id === item.id);
                    if (existingIndex >= 0) {
                        store[storeKey][existingIndex] = { ...store[storeKey][existingIndex], ...item };
                    } else {
                        store[storeKey].push(item);
                    }
                    utils.saveStore();
                    return item;
                }
            }
            
            // Actualizar stock con registro de movimiento
            async updateStock(itemId, type, quantity, reason = '') {
                const item = type === 'supply' 
                    ? store.supplies.find(i => i.id === itemId)
                    : store.products.find(i => i.id === itemId);
                    
                if (!item) throw new Error('Item no encontrado');
                
                const newStock = item.stock + quantity;
                if (newStock < 0) throw new Error('Stock insuficiente');
                
                item.stock = newStock;
                item.updatedAt = new Date().toISOString();
                
                // Registrar movimiento (para auditoría en Supabase)
                const movement = {
                    id: utils.generateId(),
                    itemType: type,
                    itemId: itemId,
                    itemName: item.name,
                    movementType: quantity > 0 ? 'in' : 'out',
                    quantity: Math.abs(quantity),
                    previousStock: item.stock - quantity,
                    newStock: item.stock,
                    reason: reason,
                    createdAt: new Date().toISOString()
                };
                
                // En Supabase, esto iría a tabla 'inventory_movements'
                const movements = []
                movements.push(movement);                
                utils.saveStore();
                return item;
            }
        }
        
        // Instancia global del adaptador
        const db = new DatabaseAdapter();

        // Utility Functions
        const utils = {
            generateId: () => 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            formatDate: (date) => new Date(date).toLocaleDateString('es-MX'),
            formatCurrency: (amount) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount),
            
            // NUEVO: Guardado inteligente que respeta la separación
            saveStore: () => {
                // V21: sin persistencia local de datos de negocio.
                // Todo se guarda y se recarga desde Supabase.
                utils.checkLowStock();
            },
            
            notify: (message, type = 'success') => {
                const div = document.createElement('div');
                div.className = `notification px-6 py-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`;
                div.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${message}</div>`;
                document.getElementById('notifications').appendChild(div);
                setTimeout(() => div.remove(), 3000);
            },
            
            // NUEVO: Verificación de stock separada por tipo
            checkLowStock: () => {
                const lowSupplies = store.supplies.filter(item => item.stock <= item.minStock);
                const lowProducts = store.products.filter(item => item.stock <= item.minStock);
                const totalLow = lowSupplies.length + lowProducts.length;
                
                if (totalLow > 0) {
                    utils.notify(`⚠️ ${totalLow} items con stock bajo (${lowSupplies.length} insumos, ${lowProducts.length} productos)`, 'warning');
                }
            },
            
            // NUEVO: Helpers para categorías
            getCategoryName: (type, categoryKey, subcategoryKey = null) => {
                const cats = store.categories[type === 'supply' ? 'supplies' : 'products'];
                if (!cats || !cats[categoryKey]) return categoryKey;
                
                const cat = cats[categoryKey];
                if (subcategoryKey && cat.subcategories && cat.subcategories[subcategoryKey]) {
                    return `${cat.name} > ${cat.subcategories[subcategoryKey]}`;
                }
                return cat.name;
            },
            
            getCategoryColor: (type, categoryKey) => {
                const cats = store.categories[type === 'supply' ? 'supplies' : 'products'];
                return cats && cats[categoryKey] ? cats[categoryKey].color : '#6b7280';
            }
        };



        // ============================================================
        // V11: Capa Supabase para módulos productivos
        // ============================================================
        const supabaseData = {
            enabled: false,

            requireSupabase() {
                if (!window.supabaseClient) {
                    throw new Error('Supabase no está disponible. Recarga la página o revisa la sesión.');
                }
                this.enabled = true;
            },

            toProduct(row) {
                return {
                    id: row.id,
                    name: row.name || '',
                    sku: row.sku || '',
                    description: row.description || '',
                    category: row.category || '',
                    subcategory: row.subcategory || '',
                    type: 'product',
                    stock: Number(row.stock || 0),
                    minStock: Number(row.min_stock || 0),
                    unit: row.unit || 'pieza',
                    cost: Number(row.cost || 0),
                    salePrice: Number(row.sale_price || 0),
                    supplier: row.supplier || '',
                    location: row.location || '',
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            productToDb(product) {
                return {
                    id: product.id || ('prod_' + Date.now()),
                    name: product.name || '',
                    sku: product.sku || '',
                    description: product.description || '',
                    category: product.category || '',
                    subcategory: product.subcategory || '',
                    stock: Number(product.stock || 0),
                    min_stock: Number(product.minStock || product.min_stock || 0),
                    unit: product.unit || 'pieza',
                    cost: Number(product.cost || 0),
                    sale_price: Number(product.salePrice || product.sale_price || 0),
                    supplier: product.supplier || '',
                    location: product.location || '',
                    created_at: product.createdAt || product.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            toSupply(row) {
                return {
                    id: row.id,
                    name: row.name || '',
                    description: row.description || '',
                    category: row.category || '',
                    subcategory: row.subcategory || '',
                    type: 'supply',
                    stock: Number(row.stock || 0),
                    minStock: Number(row.min_stock || 0),
                    unit: row.unit || 'pieza',
                    cost: Number(row.cost || 0),
                    supplier: row.supplier || '',
                    location: row.location || '',
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            supplyToDb(supply) {
                return {
                    id: supply.id || ('sup_' + Date.now()),
                    name: supply.name || '',
                    description: supply.description || '',
                    category: supply.category || '',
                    subcategory: supply.subcategory || '',
                    stock: Number(supply.stock || 0),
                    min_stock: Number(supply.minStock || supply.min_stock || 0),
                    unit: supply.unit || 'pieza',
                    cost: Number(supply.cost || 0),
                    supplier: supply.supplier || '',
                    location: supply.location || '',
                    created_at: supply.createdAt || supply.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            toClient(row) {
                return {
                    id: row.id,
                    name: row.name || row.full_name || 'Cliente',
                    phone: row.phone || '',
                    phone2: row.phone2 || '',
                    email: row.email || '',
                    type: row.type || 'menudeo',
                    discount: Number(row.discount || 0),
                    address: row.address || {},
                    rfc: row.rfc || '',
                    regimenFiscal: row.regimen_fiscal || row.regimenFiscal || '',
                    usoCFDI: row.uso_cfdi || row.usoCFDI || '',
                    notes: row.notes || '',
                    designs: row.designs || [],
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            clientToDb(client) {
                return {
                    id: client.id || utils.generateId(),
                    name: client.name || '',
                    phone: client.phone || '',
                    phone2: client.phone2 || '',
                    email: client.email || '',
                    type: client.type || 'menudeo',
                    discount: Number(client.discount || 0),
                    rfc: client.rfc || '',
                    regimen_fiscal: client.regimenFiscal || '',
                    uso_cfdi: client.usoCFDI || '',
                    address: client.address || {},
                    notes: client.notes || '',
                    designs: client.designs || [],
                    created_at: client.createdAt || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            toOrder(row) {
                return {
                    id: row.id,
                    clientId: row.client_id,
                    clientName: row.client_name || '',
                    clientPhone: row.client_phone || '',
                    status: row.status || 'recibido',
                    deliveryType: row.delivery_type || 'local',
                    deliveryAddress: row.delivery_address || '',
                    partialDelivery: !!row.partial_delivery,
                    items: Array.isArray(row.items) ? row.items : [],
                    description: row.description || '',
                    total: Number(row.total || 0),
                    stockProcessed: !!row.stock_processed,
                    financeProcessed: !!row.finance_processed,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            normalizeDeliveryType(value) {
                const raw = String(value || 'local').toLowerCase().trim();
                const map = { local: 'local', 'entrega en local': 'local', tienda: 'local', pickup: 'pickup', recoge: 'pickup', 'recoge cliente': 'pickup', shipping: 'shipping', envio: 'shipping', envío: 'shipping', paqueteria: 'shipping', paquetería: 'shipping' };
                return map[raw] || 'local';
            },

            orderToDb(order) {
                return {
                    id: String(order.id || utils.generateId()),
                    client_id: order.clientId || null,
                    client_name: order.clientName || '',
                    client_phone: order.clientPhone || '',
                    status: order.status || 'recibido',
                    delivery_type: this.normalizeDeliveryType(order.deliveryType),
                    delivery_address: order.deliveryAddress || '',
                    partial_delivery: !!order.partialDelivery,
                    items: Array.isArray(order.items) ? order.items : [],
                    description: order.description || '',
                    total: Number(order.total || 0),
                    stock_processed: !!order.stockProcessed,
                    finance_processed: !!order.financeProcessed,
                    created_at: order.createdAt || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            toFinance(row) {
                return {
                    id: row.id,
                    tipo: row.type === 'income' ? 'venta' : (row.category === 'insumos' ? 'gasto_insumo' : 'gasto_operativo'),
                    concepto: row.concept || '',
                    categoria: row.category || '',
                    pedidoId: row.order_id || '',
                    pedidoRef: row.order_id || '',
                    monto: Number(row.amount || 0),
                    notas: row.notes || '',
                    fecha: row.created_at || new Date().toISOString(),
                    createdAt: row.created_at
                };
            },

            financeToDb(mov) {
                const type = mov.tipo === 'venta' ? 'income' : 'expense';
                const category = mov.tipo === 'gasto_insumo' ? 'insumos' : (mov.categoria || (mov.tipo === 'venta' ? 'pedido' : 'operativo'));
                return {
                    type,
                    concept: mov.concepto || '',
                    category,
                    order_id: mov.pedidoId || mov.pedidoRef || null,
                    amount: Number(mov.monto || 0),
                    notes: mov.notas || null,
                    created_at: mov.fecha || new Date().toISOString()
                };
            },

            toQuote(row) {
                const items = Array.isArray(row.items) ? row.items : [];
                const first = items[0] || {};
                const converted = row.status === 'convertida' || !!row.converted_order_id;
                return {
                    id: row.id,
                    clientId: row.client_id,
                    clientName: row.client_name || '',
                    clientPhone: row.client_phone || '',
                    status: row.status || 'pendiente',
                    items,
                    productId: first.productId || first.product_id || first.id || '',
                    productName: first.productName || first.product_name || first.name || 'Producto no especificado',
                    qty: Number(first.quantity || first.qty || 0),
                    size: first.size || '',
                    colors: first.colors || '',
                    subtotal: Number(row.subtotal || 0),
                    discount: Number(row.discount || 0),
                    total: Number(row.total || 0),
                    notes: row.notes || '',
                    validUntil: row.valid_until,
                    expiresAt: row.valid_until || row.created_at,
                    convertedOrderId: row.converted_order_id || null,
                    convertedToOrder: converted,
                    orderId: row.converted_order_id || null,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            quoteToDb(quote) {
                const items = Array.isArray(quote.items) && quote.items.length ? quote.items : [{
                    productId: quote.productId || 'custom',
                    productName: quote.productName || 'Producto no especificado',
                    quantity: Number(quote.qty || 0),
                    price: Number(quote.qty || 0) ? Number(quote.total || 0) / Number(quote.qty || 1) : Number(quote.total || 0),
                    size: quote.size || '',
                    colors: quote.colors || '',
                    description: quote.notes || ''
                }];
                return {
                    id: String(quote.id || utils.generateId()),
                    client_id: quote.clientId || null,
                    client_name: quote.clientName || '',
                    client_phone: quote.clientPhone || '',
                    status: quote.convertedToOrder || quote.status === 'convertida' ? 'convertida' : (quote.status || 'pendiente'),
                    items,
                    subtotal: Number(quote.subtotal || quote.total || 0),
                    discount: Number(quote.discount || 0),
                    total: Number(quote.total || 0),
                    notes: quote.notes || '',
                    valid_until: (quote.validUntil || quote.expiresAt || '').slice(0,10) || null,
                    converted_order_id: quote.convertedOrderId || quote.orderId || null,
                    created_at: quote.createdAt || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            toDesign(row) {
                return {
                    id: row.id,
                    name: row.name || '',
                    clientId: row.client_id || null,
                    clientName: row.client_name || 'Sin cliente',
                    fileName: row.file_name || row.filename || '',
                    fileSize: row.file_size || '',
                    fileType: row.file_type || '',
                    notes: row.notes || '',
                    imageData: row.image_data || null,
                    iconUrl: row.icon_url || null,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            },

            designToDb(design) {
                return {
                    id: String(design.id || utils.generateId()),
                    name: design.name || '',
                    client_id: design.clientId || null,
                    client_name: design.clientName || '',
                    file_name: design.fileName || '',
                    file_size: design.fileSize || '',
                    file_type: design.fileType || '',
                    notes: design.notes || '',
                    image_data: design.imageData || null,
                    icon_url: design.iconUrl || null,
                    created_at: design.createdAt || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            },

            async loadAll() {
                this.requireSupabase();
                const [clientsRes, suppliesRes, productsRes, ordersRes, financeRes, quotesRes, designsRes] = await Promise.all([
                    supabaseClient.from('clients').select('*').order('name', { ascending: true }),
                    supabaseClient.from('supplies').select('*').order('name', { ascending: true }),
                    supabaseClient.from('products').select('*').order('name', { ascending: true }),
                    supabaseClient.from('orders').select('*').order('created_at', { ascending: false }),
                    supabaseClient.from('finance_movements').select('*').order('created_at', { ascending: false }),
                    supabaseClient.from('quotes').select('*').order('created_at', { ascending: false }),
                    supabaseClient.from('designs').select('*').order('created_at', { ascending: false })
                ]);
                const errors = [clientsRes, suppliesRes, productsRes, ordersRes, financeRes, quotesRes, designsRes].filter(r => r.error).map(r => r.error.message).join(' | ');
                if (errors) console.warn('V21 Supabase load warnings:', errors);
                if (!clientsRes.error) store.clients = clientsRes.data.map(r => this.toClient(r));
                if (!suppliesRes.error) store.supplies = suppliesRes.data.map(r => this.toSupply(r));
                if (!productsRes.error) store.products = productsRes.data.map(r => this.toProduct(r));
                if (!ordersRes.error) store.orders = ordersRes.data.map(r => this.toOrder(r));
                if (!financeRes.error) store.finanzas = financeRes.data.map(r => this.toFinance(r));
                if (!quotesRes.error) store.quotes = quotesRes.data.map(r => this.toQuote(r));
                if (!designsRes.error) store.designs = designsRes.data.map(r => this.toDesign(r));
                utils.saveStore();
            },

            async saveClient(client) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('clients').upsert(this.clientToDb(client), { onConflict: 'id' }).select('*').single();
                if (error) throw error;
                const saved = this.toClient(data);
                const idx = store.clients.findIndex(c => c.id === saved.id);
                if (idx >= 0) store.clients[idx] = saved; else store.clients.push(saved);
                return saved;
            },

            async deleteClient(clientId) {
                this.requireSupabase();
                const { error } = await supabaseClient.from('clients').delete().eq('id', clientId);
                if (error) throw error;
                store.clients = store.clients.filter(c => c.id !== clientId);
            },

            async saveOrder(order) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.rpc('save_order_safe', { p_order: this.orderToDb(order) });
                if (error) throw error;
                const idx = store.orders.findIndex(o => o.id === order.id);
                if (idx >= 0) store.orders[idx] = order; else store.orders.push(order);
                return data || order;
            },

            async updateOrder(order, previousStatus = null) {
                this.requireSupabase();
                if (order.status === 'entregado' && previousStatus !== 'entregado') {
                    await this.processDeliveredOrder(order);
                } else {
                    const { error } = await supabaseClient.rpc('save_order_safe', { p_order: this.orderToDb(order) });
                    if (error) throw error;
                }
                await this.loadAll();
            },

            async deleteOrder(orderId) {
                this.requireSupabase();
                const { error } = await supabaseClient.from('orders').delete().eq('id', orderId);
                if (error) throw error;
                store.orders = store.orders.filter(o => o.id !== orderId);
            },

            async processDeliveredOrder(order) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.rpc('process_order_delivery', { p_order_id: order.id });
                if (error) throw error;
                await this.loadAll();
                utils.notify(`Entrega procesada: stock descontado e ingreso registrado (${utils.formatCurrency(Number(order.total || 0))})`, 'success');
                return data;
            },

            async saveSupply(supply) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('supplies').upsert(this.supplyToDb(supply), { onConflict: 'id' }).select('*').single();
                if (error) throw error;
                const saved = this.toSupply(data);
                const idx = store.supplies.findIndex(i => i.id === saved.id);
                if (idx >= 0) store.supplies[idx] = saved; else store.supplies.push(saved);
                return saved;
            },

            async saveProduct(product) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('products').upsert(this.productToDb(product), { onConflict: 'id' }).select('*').single();
                if (error) throw error;
                const saved = this.toProduct(data);
                const idx = store.products.findIndex(i => i.id === saved.id);
                if (idx >= 0) store.products[idx] = saved; else store.products.push(saved);
                return saved;
            },

            async deleteItem(itemId, type) {
                this.requireSupabase();
                const table = type === 'supply' ? 'supplies' : 'products';
                const { error } = await supabaseClient.from(table).delete().eq('id', itemId);
                if (error) throw error;
                const key = type === 'supply' ? 'supplies' : 'products';
                store[key] = store[key].filter(i => i.id !== itemId);
            },

            async saveFinance(mov) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('finance_movements').insert(this.financeToDb(mov)).select('*').single();
                if (error) throw error;
                const saved = this.toFinance(data);
                store.finanzas.unshift(saved);
                return saved;
            },

            async deleteFinance(id) {
                this.requireSupabase();
                const { error } = await supabaseClient.from('finance_movements').delete().eq('id', id);
                if (error) throw error;
                store.finanzas = store.finanzas.filter(m => m.id !== id);
            },

            async saveQuote(quote) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('quotes').upsert(this.quoteToDb(quote), { onConflict: 'id' }).select('*').single();
                if (error) throw error;
                const saved = this.toQuote(data);
                const idx = store.quotes.findIndex(q => q.id === saved.id);
                if (idx >= 0) store.quotes[idx] = saved; else store.quotes.push(saved);
                return saved;
            },

            async saveDesign(design) {
                this.requireSupabase();
                const { data, error } = await supabaseClient.from('designs').upsert(this.designToDb(design), { onConflict: 'id' }).select('*').single();
                if (error) throw error;
                const saved = this.toDesign(data);
                const idx = store.designs.findIndex(d => d.id === saved.id);
                if (idx >= 0) store.designs[idx] = saved; else store.designs.push(saved);
                return saved;
            },

            async deleteDesign(designId) {
                this.requireSupabase();
                const { error } = await supabaseClient.from('designs').delete().eq('id', designId);
                if (error) throw error;
                store.designs = store.designs.filter(d => d.id !== designId);
            }
        };
        window.supabaseData = supabaseData;

        // Views
        const views = {
            dashboard: () => {
                const today = new Date().toISOString().split('T')[0];
                const todayOrders = store.orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
                const pendingOrders = store.orders.filter(o => o.status !== 'entregado' && o.status !== 'cancelado');
                
                // NUEVO: Verificación de stock separada
                const lowSupplies = store.supplies.filter(i => i.stock <= i.minStock);
                const lowProducts = store.products.filter(i => i.stock <= i.minStock);
                
                return `
                    <div class="space-y-6 fade-in">
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="p-3 bg-blue-100 rounded-lg text-blue-600"><i class="fas fa-shopping-bag text-xl"></i></div>
                                    <span class="text-sm text-gray-500">Hoy</span>
                                </div>
                                <p class="text-3xl font-bold text-gray-800">${todayOrders.length}</p>
                                <p class="text-sm text-gray-600">Pedidos nuevos</p>
                            </div>
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="p-3 bg-yellow-100 rounded-lg text-yellow-600"><i class="fas fa-clock text-xl"></i></div>
                                    <span class="text-sm text-gray-500">Activos</span>
                                </div>
                                <p class="text-3xl font-bold text-gray-800">${pendingOrders.length}</p>
                                <p class="text-sm text-gray-600">En producción</p>
                            </div>
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover cursor-pointer" onclick="router.navigate('finanzas')" data-admin-only="true">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="p-3 bg-green-100 rounded-lg text-green-600"><i class="fas fa-coins text-xl"></i></div>
                                    <span class="text-sm text-gray-500">Finanzas</span>
                                </div>
                                <p class="text-3xl font-bold text-gray-800">${utils.formatCurrency(store.finanzas ? store.finanzas.filter(m => { const d=new Date(m.fecha); return d.getMonth()===new Date().getMonth()&&d.getFullYear()===new Date().getFullYear()&&m.tipo==='venta'; }).reduce((a,m)=>a+m.monto,0) : 0)}</p>
                                <p class="text-sm text-gray-600">Ventas del mes</p>
                            </div>
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover ${(lowSupplies.length + lowProducts.length) > 0 ? 'border-red-300 bg-red-50' : ''}">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="p-3 ${(lowSupplies.length + lowProducts.length) > 0 ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-600'} rounded-lg"><i class="fas fa-box text-xl"></i></div>
                                    <span class="text-sm text-gray-500">Alerta</span>
                                </div>
                                <p class="text-3xl font-bold ${(lowSupplies.length + lowProducts.length) > 0 ? 'text-red-600' : 'text-gray-800'}">${lowSupplies.length + lowProducts.length}</p>
                                <p class="text-sm text-gray-600">Stock bajo (${lowSupplies.length} insumos, ${lowProducts.length} prod.)</p>
                            </div>
                        </div>

                        <!-- Kanban Board -->
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
                                <i class="fas fa-columns text-indigo-600"></i> Pipeline de Producción
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                ${['recibido', 'diseno', 'impresion', 'terminado', 'entregado'].map(status => {
                                    const statusOrders = store.orders.filter(o => o.status === status);
                                    const colors = {
                                        recibido: 'bg-gray-100 border-gray-300',
                                        diseno: 'bg-blue-50 border-blue-200',
                                        impresion: 'bg-purple-50 border-purple-200',
                                        terminado: 'bg-green-50 border-green-200',
                                        entregado: 'bg-slate-50 border-slate-200'
                                    };
                                    const labels = {
                                        recibido: 'Recibido',
                                        diseno: 'Diseño',
                                        impresion: 'Impresión',
                                        terminado: 'Terminado',
                                        entregado: 'Entregado'
                                    };
                                    return `
                                        <div class="kanban-column rounded-xl border-2 ${colors[status]} p-3" ondrop="kanban.drop(event, '${status}')" ondragover="kanban.allowDrop(event)">
                                            <div class="flex items-center justify-between mb-3 px-2">
                                                <span class="font-semibold text-sm text-gray-700">${labels[status]}</span>
                                                <span class="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">${statusOrders.length}</span>
                                            </div>
                                            <div class="space-y-2">
                                                ${statusOrders.map(order => `
                                                    <div draggable="true" ondragstart="kanban.drag(event, '${order.id}')" onclick="views.showOrderDetail('${order.id}')" 
                                                         class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all group">
                                                        <div class="flex justify-between items-start mb-2">
                                                            <span class="text-xs text-gray-500">${utils.formatDate(order.createdAt)}</span>
                                                        </div>
                                                        <p class="text-sm text-gray-600 mb-2 line-clamp-2">${order.description || 'Sin descripción'}</p>
                                                        <div class="flex items-center justify-between text-xs">
                                                            <span class="text-gray-500">${order.clientName}</span>
                                                            <span class="font-semibold text-indigo-600">${utils.formatCurrency(order.total)}</span>
                                                        </div>
                                                        ${order.partialDelivery ? '<span class="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Entrega parcial</span>' : ''}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 class="text-lg font-bold mb-4">Últimos Pedidos</h3>
                                <div class="space-y-3">
                                    ${store.orders.slice(-5).reverse().map(order => `
                                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <i class="fas fa-tshirt"></i>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-sm">#${order.id.substr(-4)} - ${order.clientName}</p>
                                                    <p class="text-xs text-gray-500">${order.items?.length || 0} artículos</p>
                                                </div>
                                            </div>
                                            <span class="text-sm font-semibold text-gray-800">${utils.formatCurrency(order.total)}</span>
                                        </div>
                                    `).join('') || '<p class="text-gray-500 text-center py-4">No hay pedidos recientes</p>'}
                                </div>
                            </div>
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 class="text-lg font-bold mb-4">Cotizaciones por Vencer</h3>
                                <div class="space-y-3">
                                    ${store.quotes.filter(q => new Date(q.expiresAt) > new Date() && new Date(q.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map(quote => `
                                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-yellow-400">
                                            <div>
                                                <p class="font-medium text-sm">${quote.clientName}</p>
                                                <p class="text-xs text-gray-500">${quote.productName || 'Producto no especificado'}</p>
                                                <p class="text-xs text-gray-400">Vence: ${utils.formatDate(quote.expiresAt)}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-sm font-semibold text-gray-800">${utils.formatCurrency(quote.total)}</p>
                                                <button onclick="quoteToOrder('${quote.id}')" class="text-xs text-indigo-600 hover:underline">Convertir</button>
                                            </div>
                                        </div>
                                    `).join('') || '<p class="text-gray-500 text-center py-4">No hay cotizaciones urgentes</p>'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            orders: () => {
                return `
                    <div class="space-y-6 fade-in">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div class="flex gap-2">
                                <input type="text" id="orderSearch" placeholder="Buscar pedido..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" onkeyup="views.filterOrders()">
                                <select id="orderStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onchange="views.filterOrders()">
                                    <option value="">Todos los estados</option>
                                    <option value="recibido">Recibido</option>
                                    <option value="diseno">En Diseño</option>
                                    <option value="impresion">En Impresión</option>
                                    <option value="terminado">Terminado</option>
                                    <option value="entregado">Entregado</option>
                                </select>
                            </div>
                            <button onclick="showQuickOrder()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>Nuevo Pedido
                            </button>
                        </div>

                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ordersTableBody" class="divide-y divide-gray-100">
                                        ${views.renderOrdersTable(store.orders)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderOrdersTable: (orders) => {
                if (orders.length === 0) return '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">No hay pedidos registrados</td></tr>';
                
                const statusColors = {
                    recibido: 'bg-gray-100 text-gray-700',
                    diseno: 'bg-blue-100 text-blue-700',
                    impresion: 'bg-purple-100 text-purple-700',
                    terminado: 'bg-green-100 text-green-700',
                    entregado: 'bg-slate-100 text-slate-700',
                    cancelado: 'bg-red-100 text-red-700'
                };
                
                const statusLabels = {
                    recibido: 'Recibido',
                    diseno: 'Diseño',
                    impresion: 'Impresión',
                    terminado: 'Terminado',
                    entregado: 'Entregado',
                    cancelado: 'Cancelado'
                };

                return orders.map(order => `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-gray-900">#${order.id.substr(-6)}</td>
                        <td class="px-6 py-4">
                            <div class="font-medium text-gray-900">${order.clientName}</div>
                            <div class="text-sm text-gray-500">${order.clientPhone || ''}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${order.description || '-'}</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]} status-pill">
                                ${statusLabels[order.status]}
                            </span>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900">${utils.formatCurrency(order.total)}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${utils.formatDate(order.createdAt)}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="views.showOrderDetail('${order.id}')" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver detalle">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button onclick="views.editOrder('${order.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="views.printOrder('${order.id}')" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Imprimir">
                                    <i class="fas fa-print"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            },

            filterOrders: () => {
                const search = document.getElementById('orderSearch').value.toLowerCase();
                const status = document.getElementById('orderStatus').value;
                
                let filtered = store.orders;
                if (search) {
                    filtered = filtered.filter(o => 
                        o.clientName.toLowerCase().includes(search) || 
                        o.id.toLowerCase().includes(search) ||
                        (o.description && o.description.toLowerCase().includes(search))
                    );
                }
                if (status) {
                    filtered = filtered.filter(o => o.status === status);
                }
                
                document.getElementById('ordersTableBody').innerHTML = views.renderOrdersTable(filtered);
            },

            showOrderDetail: (orderId) => {
                const order = store.orders.find(o => o.id === orderId);
                if (!order) return;

                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Pedido #${order.id.substr(-6)}</h2>
                                <p class="text-gray-500 mt-1">Creado el ${utils.formatDate(order.createdAt)}</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div class="bg-gray-50 p-4 rounded-xl">
                                <h3 class="font-semibold text-gray-700 mb-3">Cliente</h3>
                                <p class="font-medium text-gray-900">${order.clientName}</p>
                                <p class="text-sm text-gray-600">${order.clientPhone || 'Sin teléfono'}</p>
                                <p class="text-sm text-gray-600">${order.clientEmail || ''}</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-xl">
                                <h3 class="font-semibold text-gray-700 mb-3">Entrega</h3>
                                <p class="text-sm text-gray-600"><i class="fas fa-map-marker-alt mr-2"></i>${order.deliveryType === 'local' ? 'Entrega en local' : order.deliveryType === 'shipping' ? 'Envío por paquetería' : 'Recoge cliente'}</p>
                                ${order.deliveryAddress ? `<p class="text-sm text-gray-600 mt-1">${order.deliveryAddress}</p>` : ''}
                                ${order.partialDelivery ? '<span class="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Entrega parcial programada</span>' : ''}
                            </div>
                        </div>

                        <div class="mb-6">
                            <h3 class="font-semibold text-gray-700 mb-3">Artículos</h3>
                            <div class="bg-gray-50 rounded-xl overflow-hidden">
                                <table class="w-full">
                                    <thead class="bg-gray-100">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Producto</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Notas</th>
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cantidad</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">Precio Unit.</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        ${order.items?.map(item => `
                                            <tr>
                                                <td class="px-4 py-3 text-sm text-gray-800 font-medium">${item.productName || 'Producto personalizado'}</td>
                                                <td class="px-4 py-3 text-sm text-gray-600">${item.description || '-'}</td>
                                                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.quantity}</td>
                                                <td class="px-4 py-3 text-sm text-gray-600 text-right">${utils.formatCurrency(item.price)}</td>
                                                <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">${utils.formatCurrency(item.quantity * item.price)}</td>
                                            </tr>
                                        `).join('') || '<tr><td colspan="5" class="px-4 py-3 text-center text-gray-500">Sin artículos</td></tr>'}
                                    </tbody>
                                    <tfoot class="bg-gray-100 font-semibold">
                                        <tr>
                                            <td colspan="4" class="px-4 py-3 text-right text-gray-700">Total:</td>
                                            <td class="px-4 py-3 text-right text-indigo-600">${utils.formatCurrency(order.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div class="mb-6">
                            <h3 class="font-semibold text-gray-700 mb-3">Progreso</h3>
                            <div class="flex items-center justify-between mb-2">
                                ${['recibido', 'diseno', 'impresion', 'terminado', 'entregado'].map((step, idx) => {
                                    const steps = ['recibido', 'diseno', 'impresion', 'terminado', 'entregado'];
                                    const currentIdx = steps.indexOf(order.status);
                                    const isActive = idx <= currentIdx;
                                    const isCurrent = idx === currentIdx;
                                    return `
                                        <div class="flex flex-col items-center flex-1 ${idx < 4 ? 'relative' : ''}">
                                            ${idx < 4 ? `<div class="absolute top-4 left-1/2 w-full h-0.5 ${isActive ? 'bg-indigo-600' : 'bg-gray-300'}"></div>` : ''}
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'} ${isCurrent ? 'ring-4 ring-indigo-200' : ''}">
                                                ${idx + 1}
                                            </div>
                                            <span class="text-xs mt-2 text-gray-600 capitalize">${step}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="flex gap-3 justify-end">
                            <button onclick="views.editOrder('${order.id}')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Editar Pedido
                            </button>
                        </div>
                    </div>
                `;
                openModal();
            },

            quotes: () => {
                return `
                    <div class="space-y-6 fade-in">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div class="flex gap-2">
                                <input type="text" id="quoteSearch" placeholder="Buscar cotización..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onkeyup="views.filterQuotes()">
                                <select id="quoteStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onchange="views.filterQuotes()">
                                    <option value="">Todos</option>
                                    <option value="active">Vigentes</option>
                                    <option value="expired">Vencidas</option>
                                    <option value="converted">Convertidas</option>
                                </select>
                            </div>
                            <button onclick="showQuickQuote()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>Nueva Cotización
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="quotesGrid">
                            ${views.renderQuotesGrid(store.quotes)}
                        </div>
                    </div>
                `;
            },

            renderQuotesGrid: (quotes) => {
                if (quotes.length === 0) return '<div class="col-span-full text-center py-12 text-gray-500">No hay cotizaciones registradas</div>';

                return quotes.map(quote => {
                    const isExpired = new Date(quote.expiresAt) < new Date();
                    const isConverted = quote.convertedToOrder;
                    
                    return `
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover ${isExpired && !isConverted ? 'border-red-300' : ''}">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="text-xs text-gray-500">Cotización #${quote.id.substr(-4)}</span>
                                    <h3 class="font-bold text-lg text-gray-800 mt-1">${quote.clientName}</h3>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-medium ${isConverted ? 'bg-green-100 text-green-700' : isExpired ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                                    ${isConverted ? 'Convertida' : isExpired ? 'Vencida' : 'Vigente'}
                                </span>
                            </div>
                            
                            <div class="space-y-2 mb-4">
                                <p class="text-sm text-gray-600"><i class="fas fa-box mr-2 text-gray-400"></i>${quote.productName || 'Producto no especificado'}</p>
                                <p class="text-sm text-gray-600"><i class="fas fa-calendar-alt mr-2 text-gray-400"></i>Creada: ${utils.formatDate(quote.createdAt)}</p>
                                <p class="text-sm text-gray-600"><i class="fas fa-hourglass-half mr-2 text-gray-400"></i>Vence: ${utils.formatDate(quote.expiresAt)}</p>
                                <p class="text-sm text-gray-600"><i class="fas fa-tshirt mr-2 text-gray-400"></i>${quote.qty || 0} piezas</p>
                            </div>

                            <div class="border-t pt-4 mb-4">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Total:</span>
                                    <span class="text-2xl font-bold text-indigo-600">${utils.formatCurrency(quote.total)}</span>
                                </div>
                            </div>

                            <div class="flex gap-2">
                                ${!isConverted ? `
                                    <button onclick="quoteToOrder('${quote.id}')" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                        Convertir a Pedido
                                    </button>
                                ` : `
                                    <button disabled class="flex-1 bg-gray-300 text-gray-500 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                                        Ya convertida
                                    </button>
                                `}
                                <button onclick="views.viewQuoteDetail('${quote.id}')" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            },

            filterQuotes: () => {
                const search = document.getElementById('quoteSearch').value.toLowerCase();
                const status = document.getElementById('quoteStatus').value;
                
                let filtered = store.quotes;
                if (search) {
                    filtered = filtered.filter(q => 
                        q.clientName.toLowerCase().includes(search) || 
                        q.productName?.toLowerCase().includes(search) ||
                        q.id.toLowerCase().includes(search)
                    );
                }
                if (status) {
                    filtered = filtered.filter(q => {
                        if (status === 'expired') return new Date(q.expiresAt) < new Date() && !q.convertedToOrder;
                        if (status === 'active') return new Date(q.expiresAt) >= new Date() && !q.convertedToOrder;
                        if (status === 'converted') return q.convertedToOrder;
                        return true;
                    });
                }
                
                document.getElementById('quotesGrid').innerHTML = views.renderQuotesGrid(filtered);
            },

            // ============================================================
            // NUEVO: Vista de Inventario con Tabs Separados
            // ============================================================
            inventory: () => {
                const lowSupplies = store.supplies.filter(i => i.stock <= i.minStock);
                const lowProducts = store.products.filter(i => i.stock <= i.minStock);
                
                return `
                    <div class="space-y-6 fade-in">
                        <!-- Header con Tabs -->
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="border-b border-gray-200">
                                <div class="flex">
                                    <button onclick="switchInventoryTab('supplies')" id="tab-supplies" class="inventory-tab active flex-1 px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none">
                                        <i class="fas fa-tools mr-2"></i>
                                        Insumos (Supplies)
                                        <span class="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">${store.supplies.length}</span>
                                    </button>
                                    <button onclick="switchInventoryTab('products')" id="tab-products" class="inventory-tab flex-1 px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none">
                                        <i class="fas fa-tshirt mr-2"></i>
                                        Productos (Products)
                                        <span class="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">${store.products.length}</span>
                                    </button>
                                    <button onclick="switchInventoryTab('all')" id="tab-all" class="inventory-tab flex-1 px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none">
                                        <i class="fas fa-th-large mr-2"></i>
                                        Vista General
                                        <span class="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">${store.supplies.length + store.products.length}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Contenido de Tabs -->
                            <div id="inventory-content-supplies" class="p-6">
                                ${views.renderSuppliesTab(lowSupplies)}
                            </div>
                            <div id="inventory-content-products" class="p-6 hidden">
                                ${views.renderProductsTab(lowProducts)}
                            </div>
                            <div id="inventory-content-all" class="p-6 hidden">
                                ${views.renderAllInventoryTab()}
                            </div>
                        </div>
                    </div>
                `;
            },

            // Renderizar Tab de Insumos
            renderSuppliesTab: (lowStock) => {
                return `
                    <div class="space-y-6">
                        <!-- Alertas de Stock Bajo -->
                        ${lowStock.length > 0 ? `
                            <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 class="text-red-800 font-semibold mb-3 flex items-center gap-2">
                                    <i class="fas fa-exclamation-triangle"></i> 
                                    Alertas de Stock Bajo - Insumos
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    ${lowStock.map(item => views.renderLowStockCard(item, 'supply')).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Filtros -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div class="flex gap-2 flex-wrap">
                                <input type="text" id="supplySearch" placeholder="Buscar insumo..." 
                                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                    onkeyup="filterSupplies()">
                                <select id="supplyCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" onchange="filterSupplies()">
                                    <option value="">Todas las categorías</option>
                                    ${Object.entries(store.categories.supplies).map(([key, cat]) => 
                                        `<option value="${key}">${cat.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <button onclick="views.showAddSupply()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>Agregar Insumo
                            </button>
                        </div>

                        <!-- Tabla de Insumos -->
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-purple-50 border-b border-purple-200">
                                    <tr>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Insumo</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Categoría</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Stock</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Ubicación</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Costo Unit.</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="suppliesTableBody" class="divide-y divide-gray-100">
                                    ${views.renderSuppliesTable(store.supplies)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            },

            // Renderizar Tab de Productos
            renderProductsTab: (lowStock) => {
                return `
                    <div class="space-y-6">
                        <!-- Alertas de Stock Bajo -->
                        ${lowStock.length > 0 ? `
                            <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 class="text-red-800 font-semibold mb-3 flex items-center gap-2">
                                    <i class="fas fa-exclamation-triangle"></i> 
                                    Alertas de Stock Bajo - Productos
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    ${lowStock.map(item => views.renderLowStockCard(item, 'product')).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Filtros -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div class="flex gap-2 flex-wrap">
                                <input type="text" id="productSearch" placeholder="Buscar producto..." 
                                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    onkeyup="filterProducts()">
                                <select id="productCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterProducts()">
                                    <option value="">Todas las categorías</option>
                                    ${Object.entries(store.categories.products).map(([key, cat]) => 
                                        `<option value="${key}">${cat.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <button onclick="views.showAddProduct()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>Agregar Producto
                            </button>
                        </div>

                        <!-- Tabla de Productos -->
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-blue-50 border-b border-blue-200">
                                    <tr>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">Producto</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">SKU</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">Categoría</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">Stock</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">Precio Venta</th>
                                        <th class="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="productsTableBody" class="divide-y divide-gray-100">
                                    ${views.renderProductsTable(store.products)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            },

            // Renderizar Vista General (Legacy + Nuevo)
            renderAllInventoryTab: () => {
                return `
                    <div class="space-y-6">
                        <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <h3 class="text-indigo-800 font-semibold mb-2 flex items-center gap-2">
                                <i class="fas fa-info-circle"></i>
                                Vista General del Inventario
                            </h3>
                            <p class="text-sm text-indigo-700">
                                Esta vista muestra todos los items del inventario. Para operaciones específicas, 
                                usa las pestañas de Insumos o Productos.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Resumen de Insumos -->
                            <div class="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 class="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-tools"></i> Insumos
                                </h4>
                                <div class="space-y-2 max-h-64 overflow-y-auto">
                                    ${store.supplies.map(item => `
                                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div>
                                                <p class="font-medium text-sm">${item.name}</p>
                                                <p class="text-xs text-gray-500">${utils.getCategoryName('supply', item.category)}</p>
                                            </div>
                                            <span class="text-sm font-bold ${item.stock <= item.minStock ? 'text-red-600' : 'text-gray-700'}">
                                                ${item.stock} ${item.unit}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Resumen de Productos -->
                            <div class="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-tshirt"></i> Productos
                                </h4>
                                <div class="space-y-2 max-h-64 overflow-y-auto">
                                    ${store.products.map(item => `
                                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div>
                                                <p class="font-medium text-sm">${item.name}</p>
                                                <p class="text-xs text-gray-500">${item.sku || 'Sin SKU'}</p>
                                            </div>
                                            <span class="text-sm font-bold ${item.stock <= item.minStock ? 'text-red-600' : 'text-gray-700'}">
                                                ${item.stock} ${item.unit}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            // Helper: Tarjeta de stock bajo
            renderLowStockCard: (item, type) => {
                const colorClass = type === 'supply' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200';
                const btnColor = type === 'supply' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';
                
                return `
                    <div class="${colorClass} border p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p class="font-medium text-gray-800 text-sm">${item.name}</p>
                            <p class="text-xs text-red-600">Stock: ${item.stock} ${item.unit} (Min: ${item.minStock})</p>
                        </div>
                        <button onclick="views.openStockMovement('${item.id}', '${type}', 'in')" 
                            class="px-3 py-1 ${btnColor} text-white rounded text-sm transition-colors">
                            Ajustar
                        </button>
                    </div>
                `;
            },

            // Tabla de Insumos
            renderSuppliesTable: (items) => {
                if (items.length === 0) return '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">No hay insumos registrados</td></tr>';
                
                return items.map(item => {
                    const catColor = utils.getCategoryColor('supply', item.category);
                    const catName = utils.getCategoryName('supply', item.category, item.subcategory);
                    
                    return `
                        <tr class="hover:bg-gray-50 transition-colors ${item.stock <= item.minStock ? 'bg-red-50' : ''}">
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900">${item.name}</div>
                                <div class="text-xs text-gray-500">${item.description || ''}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="category-badge" style="background: ${catColor}20; color: ${catColor}">
                                    ${catName}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold ${item.stock <= item.minStock ? 'text-red-600' : 'text-gray-900'}">${item.stock}</span>
                                    <span class="text-sm text-gray-500">${item.unit}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">${item.location || '-'}</td>
                            <td class="px-6 py-4 text-gray-600">${utils.formatCurrency(item.cost)}</td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button onclick="views.openStockMovement('${item.id}', 'supply', 'in')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Registrar entrada">
                                        <i class="fas fa-arrow-down"></i>
                                    </button>
                                    <button onclick="views.openStockMovement('${item.id}', 'supply', 'out')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Registrar salida">
                                        <i class="fas fa-arrow-up"></i>
                                    </button>
                                    <button onclick="views.editItem('${item.id}', 'supply')" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            },

            // Tabla de Productos
            renderProductsTable: (items) => {
                if (items.length === 0) return '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">No hay productos registrados</td></tr>';
                
                return items.map(item => {
                    const catColor = utils.getCategoryColor('product', item.category);
                    const catName = utils.getCategoryName('product', item.category, item.subcategory);
                    
                    return `
                        <tr class="hover:bg-gray-50 transition-colors ${item.stock <= item.minStock ? 'bg-red-50' : ''}">
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900">${item.name}</div>
                                <div class="text-xs text-gray-500">${item.description || ''}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${item.sku || '-'}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="category-badge" style="background: ${catColor}20; color: ${catColor}">
                                    ${catName}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold ${item.stock <= item.minStock ? 'text-red-600' : 'text-gray-900'}">${item.stock}</span>
                                    <span class="text-sm text-gray-500">${item.unit}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">${utils.formatCurrency(item.salePrice || item.cost * 2)}</div>
                                <div class="text-xs text-gray-500">Costo: ${utils.formatCurrency(item.cost)}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button onclick="views.openStockMovement('${item.id}', 'product', 'in')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Registrar entrada">
                                        <i class="fas fa-arrow-down"></i>
                                    </button>
                                    <button onclick="views.openStockMovement('${item.id}', 'product', 'out')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Registrar salida">
                                        <i class="fas fa-arrow-up"></i>
                                    </button>
                                    <button onclick="views.editItem('${item.id}', 'product')" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            },

            // Métodos de utilidad para inventario
            openStockMovement: (id, type, defaultMovement = 'in') => {
                const item = type === 'supply'
                    ? store.supplies.find(i => i.id === id)
                    : store.products.find(i => i.id === id);

                if (!item) {
                    utils.notify('Producto/Insumo no encontrado', 'error');
                    return;
                }

                const isOut = defaultMovement === 'out';
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-lg">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Movimiento de inventario</h2>
                                <p class="text-sm text-gray-500 mt-1">${item.name}</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                        </div>

                        <form onsubmit="views.handleStockMovement(event, '${id}', '${type}')" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <p class="text-xs text-gray-500">Stock actual</p>
                                    <p class="text-xl font-bold text-gray-900">${Number(item.stock || 0)} <span class="text-sm font-normal text-gray-500">${item.unit || ''}</span></p>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <p class="text-xs text-gray-500">Unidad</p>
                                    <p class="text-xl font-bold text-gray-900">${item.unit || 'pieza'}</p>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
                                <select id="stockMovementType" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                                    <option value="in" ${!isOut ? 'selected' : ''}>Entrada / carga de stock</option>
                                    <option value="out" ${isOut ? 'selected' : ''}>Salida / descuento manual</option>
                                    <option value="set">Ajuste exacto de stock</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                <input type="number" id="stockMovementQty" min="0.01" step="0.01" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ej: 1, 2.5, 0.25">
                                <p class="text-xs text-gray-500 mt-1">Usa decimales cuando aplique. Ejemplo: si la unidad es metro, 25 cm = 0.25.</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Referencia / motivo</label>
                                <input type="text" id="stockMovementReference" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Compra, ajuste, merma, corrección, etc.">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                                <textarea id="stockMovementNotes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Detalle opcional del movimiento"></textarea>
                            </div>

                            <div class="flex justify-end gap-3 pt-4">
                                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg">Cancelar</button>
                                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar movimiento</button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
            },

            handleStockMovement: async (event, id, type) => {
                event.preventDefault();

                const item = type === 'supply'
                    ? store.supplies.find(i => i.id === id)
                    : store.products.find(i => i.id === id);

                if (!item) {
                    utils.notify('Producto/Insumo no encontrado', 'error');
                    return;
                }

                const movementType = document.getElementById('stockMovementType').value;
                const qty = parseFloat(document.getElementById('stockMovementQty').value);
                const reference = document.getElementById('stockMovementReference').value.trim();
                const notes = document.getElementById('stockMovementNotes').value.trim();

                if (!Number.isFinite(qty) || qty <= 0) {
                    utils.notify('La cantidad debe ser mayor a 0', 'error');
                    return;
                }

                const previousStock = Number(item.stock || 0);
                let newStock = previousStock;
                let movementQty = qty;

                if (movementType === 'in') newStock = previousStock + qty;
                if (movementType === 'out') newStock = previousStock - qty;
                if (movementType === 'set') {
                    newStock = qty;
                    movementQty = Math.abs(newStock - previousStock);
                }

                if (newStock < 0) {
                    utils.notify(`Stock insuficiente. Disponible: ${previousStock} ${item.unit || ''}`, 'error');
                    return;
                }

                try {
                    item.stock = Number(newStock.toFixed(4));
                    item.updatedAt = new Date().toISOString();

                    if (window.supabaseClient) {
                        const table = type === 'supply' ? 'supplies' : 'products';
                        const { error: updateError } = await supabaseClient
                            .from(table)
                            .update({ stock: item.stock, updated_at: new Date().toISOString() })
                            .eq('id', id);

                        if (updateError) throw updateError;

                        await supabaseClient.from('inventory_movements').insert({
                            item_id: id,
                            item_type: type,
                            item_name: item.name,
                            type: movementType === 'in' ? 'entrada' : (movementType === 'out' ? 'salida' : 'ajuste'),
                            quantity: movementQty,
                            unit: item.unit || '',
                            previous_stock: previousStock,
                            new_stock: item.stock,
                            reference: reference || 'Movimiento manual',
                            notes: notes || null
                        });
                    }

                    utils.saveStore();
                    closeModal();
                    utils.notify(`Movimiento guardado: ${item.name} → ${item.stock} ${item.unit || ''}`, 'success');
                    await supabaseData.loadAll();
                    router.refresh();
                } catch (error) {
                    console.error('Error guardando movimiento de inventario:', error);
                    utils.notify('No se pudo guardar el movimiento: ' + error.message, 'error');
                }
            },

            // Compatibilidad con versiones anteriores. Ya no suma/resta fijo; abre captura formal.
            adjustStock: (id, type, amount) => {
                views.openStockMovement(id, type, amount < 0 ? 'out' : 'in');
            },

            editItem: (id, type) => {
                const storeKey = type === 'supply' ? 'supplies' : 'products';
                const item = store[storeKey].find(i => i.id === id);
                if (!item) return;
                const isSupply = type === 'supply';
                const color = isSupply ? 'purple' : 'blue';
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-2xl">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Editar ${isSupply ? 'Insumo' : 'Producto'}</h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                        </div>
                        <form onsubmit="handleUpdateItem(event, '${id}', '${type}')" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" id="editItemName" value="${item.name}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select id="editItemCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500" onchange="updateSubcategories('${type}Edit')">
                                        ${Object.entries(store.categories[isSupply?'supplies':'products']).map(([key,cat])=>
                                            `<option value="${key}" ${item.category===key?'selected':''}>${cat.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                                    <input type="text" id="editItemSubcategory" value="${item.subcategory||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" id="editItemStock" value="${item.stock}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                                    <input type="number" id="editItemMinStock" value="${item.minStock}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                    <select id="editItemUnit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                        ${['pieza','metro','rollo','litro','kg','caja','par'].map(u=>
                                            `<option value="${u}" ${item.unit===u?'selected':''}>${u.charAt(0).toUpperCase()+u.slice(1)}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Costo Unitario</label>
                                    <input type="number" id="editItemCost" value="${item.cost||0}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>
                                ${!isSupply ? `<div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
                                    <input type="number" id="editItemSalePrice" value="${item.salePrice||0}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>` : `<div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                    <input type="text" id="editItemLocation" value="${item.location||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">
                                </div>`}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea id="editItemDescription" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500">${item.description||''}</textarea>
                            </div>
                            <div class="flex gap-3 pt-4">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                                <button type="button" onclick="confirmDeleteItem('${id}','${type}')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
                                    <i class="fas fa-trash mr-1"></i> Eliminar
                                </button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 font-medium">
                                    <i class="fas fa-save mr-2"></i>Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
            },

            showAddSupply: () => {
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-2xl">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Nuevo Insumo</h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="handleAddSupply(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" id="newSupplyName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                                    <select id="newSupplyCategory" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" onchange="updateSubcategories('supply')">
                                        ${Object.entries(store.categories.supplies).map(([key, cat]) => 
                                            `<option value="${key}">${cat.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                                    <select id="newSupplySubcategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                        <option value="">Seleccionar...</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                    <input type="number" id="newSupplyStock" value="0" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                                    <input type="number" id="newSupplyMinStock" value="5" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                    <input type="text" id="newSupplyUnit" value="pieza" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Costo Unitario</label>
                                    <input type="number" id="newSupplyCost" value="0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                    <input type="text" id="newSupplyLocation" placeholder="Ej: Estante A1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea id="newSupplyDescription" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
                            </div>
                            
                            <div class="flex gap-3 pt-4">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Guardar Insumo</button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
                updateSubcategories('supply');
            },

            showAddProduct: () => {
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-2xl">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Nuevo Producto</h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="handleAddProduct(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" id="newProductName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                                    <select id="newProductCategory" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="updateSubcategories('product'); toggleNewCategoryInput('product')">
                                        ${Object.entries(store.categories.products).map(([key, cat]) => 
                                            `<option value="${key}">${cat.name}</option>`
                                        ).join('')}
                                        <option value="__new__">+ Nueva categoría...</option>
                                    </select>
                                    <div id="newProductCategoryInput" class="hidden mt-2">
                                        <input type="text" id="newProductCategoryName" placeholder="Nombre de la nueva categoría" class="w-full px-4 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                                    <select id="newProductSubcategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="">Seleccionar...</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                    <input type="number" id="newProductStock" value="0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                                    <input type="number" id="newProductMinStock" value="10" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                    <select id="newProductUnit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="pieza">Pieza</option>
                                        <option value="metro">Metro</option>
                                        <option value="rollo">Rollo</option>
                                        <option value="litro">Litro</option>
                                        <option value="kg">Kg</option>
                                        <option value="caja">Caja</option>
                                        <option value="par">Par</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Costo Unitario</label>
                                    <input type="number" id="newProductCost" value="0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
                                    <input type="number" id="newProductSalePrice" value="0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea id="newProductDescription" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            
                            <div class="flex gap-3 pt-4">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
                updateSubcategories('product');
            },

            clients: () => {
                const savedView = 'cards';
                return `
                    <div class="space-y-6 fade-in">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <input type="text" id="clientSearch" placeholder="Buscar cliente..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-96" onkeyup="views.filterClients()">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                                    <button id="viewToggleCards" onclick="views.setClientView('cards')" 
                                        class="px-3 py-1.5 rounded-md text-sm font-medium transition-all ${savedView === 'cards' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}" title="Vista tarjetas">
                                        <i class="fas fa-th-large"></i>
                                    </button>
                                    <button id="viewToggleList" onclick="views.setClientView('list')" 
                                        class="px-3 py-1.5 rounded-md text-sm font-medium transition-all ${savedView === 'list' ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}" title="Vista lista">
                                        <i class="fas fa-list"></i>
                                    </button>
                                </div>
                                <button onclick="views.showAddClient()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                    <i class="fas fa-plus mr-2"></i>Nuevo Cliente
                                </button>
                            </div>
                        </div>

                        <div id="clientsGrid" class="${savedView === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}">
                            ${savedView === 'cards' ? views.renderClientsGrid(store.clients) : views.renderClientsList(store.clients)}
                        </div>
                    </div>
                `;
            },

            setClientView: (mode) => {
                
                const grid = document.getElementById('clientsGrid');
                const btnCards = document.getElementById('viewToggleCards');
                const btnList = document.getElementById('viewToggleList');
                if (!grid) return;
                
                if (mode === 'cards') {
                    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
                    grid.innerHTML = views.renderClientsGrid(store.clients);
                    btnCards.className = 'px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow text-indigo-700';
                    btnList.className = 'px-3 py-1.5 rounded-md text-sm font-medium transition-all text-gray-500 hover:text-gray-700';
                } else {
                    grid.className = '';
                    grid.innerHTML = views.renderClientsList(store.clients);
                    btnList.className = 'px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow text-indigo-700';
                    btnCards.className = 'px-3 py-1.5 rounded-md text-sm font-medium transition-all text-gray-500 hover:text-gray-700';
                }
            },

            renderClientsList: (clients) => {
                if (clients.length === 0) return '<div class="text-center py-12 text-gray-500 bg-white rounded-2xl border">No hay clientes registrados</div>';
                
                const typeColors = {
                    menudeo: 'bg-gray-100 text-gray-700',
                    mayoreo: 'bg-purple-100 text-purple-700',
                    frecuente: 'bg-amber-100 text-amber-700'
                };
                const typeLabels = { menudeo: 'Menudeo', mayoreo: 'Mayoreo', frecuente: 'Frecuente' };

                return `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Contacto</th>
                                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Tipo</th>
                                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">RFC</th>
                                    <th class="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Pedidos / Total</th>
                                    <th class="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${clients.map(client => {
                                    const clientOrders = store.orders.filter(o => o.clientId === client.id);
                                    const totalSpent = clientOrders.reduce((a, b) => a + (b.total || 0), 0);
                                    return `
                                        <tr class="hover:bg-gray-50 transition-colors">
                                            <td class="px-5 py-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                        ${client.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p class="font-semibold text-sm text-gray-800">${client.name}</p>
                                                        ${client.discount > 0 ? `<span class="text-xs text-green-600"><i class="fas fa-tag mr-0.5"></i>${client.discount}% dto</span>` : ''}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-5 py-3 hidden md:table-cell">
                                                <p class="text-sm text-gray-700">${client.phone}</p>
                                                <p class="text-xs text-gray-400 truncate max-w-xs">${client.email}</p>
                                            </td>
                                            <td class="px-5 py-3 hidden sm:table-cell">
                                                <span class="px-2 py-1 rounded-full text-xs font-medium ${typeColors[client.type]}">${typeLabels[client.type]}</span>
                                            </td>
                                            <td class="px-5 py-3 hidden lg:table-cell">
                                                ${client.rfc ? `<span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">${client.rfc}</span>` : '<span class="text-gray-300 text-xs">—</span>'}
                                            </td>
                                            <td class="px-5 py-3 text-right">
                                                <p class="text-sm font-semibold text-indigo-600">${clientOrders.length} ped.</p>
                                                <p class="text-xs text-gray-500">${utils.formatCurrency(totalSpent)}</p>
                                            </td>
                                            <td class="px-5 py-3 text-right">
                                                <div class="flex items-center justify-end gap-1">
                                                    <button onclick="views.viewClientHistory('${client.id}')" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Historial"><i class="fas fa-history text-sm"></i></button>
                                                    <button onclick="views.editClient('${client.id}')" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Editar"><i class="fas fa-edit text-sm"></i></button>
                                                    <button onclick="views.showClientDetail('${client.id}')" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalle"><i class="fas fa-eye text-sm"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            },

            renderClientsGrid: (clients) => {
                if (clients.length === 0) return '<div class="col-span-full text-center py-12 text-gray-500">No hay clientes registrados</div>';

                const typeColors = {
                    menudeo: 'bg-gray-100 text-gray-700 border-gray-300',
                    mayoreo: 'bg-purple-100 text-purple-700 border-purple-300',
                    frecuente: 'bg-amber-100 text-amber-700 border-amber-300'
                };

                const typeLabels = {
                    menudeo: 'Menudeo',
                    mayoreo: 'Mayoreo',
                    frecuente: 'Frecuente'
                };

                const typeIcons = {
                    menudeo: 'fa-user',
                    mayoreo: 'fa-building',
                    frecuente: 'fa-star'
                };

                return clients.map(client => {
                    const clientOrders = store.orders.filter(o => o.clientId === client.id);
                    const totalSpent = clientOrders.reduce((a, b) => a + (b.total || 0), 0);
                    const hasFiscalData = client.rfc && client.regimenFiscal;
                    
                    return `
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 card-hover relative overflow-hidden">
                            ${hasFiscalData ? '<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-400 to-green-600 transform rotate-45 translate-x-8 -translate-y-8"></div>' : ''}
                            ${hasFiscalData ? '<i class="fas fa-file-invoice absolute top-2 right-2 text-white text-xs" title="Datos fiscales registrados"></i>' : ''}
                            
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                        ${client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-gray-800 leading-tight">${client.name}</h3>
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[client.type]} mt-1">
                                            <i class="fas ${typeIcons[client.type]}"></i>
                                            ${typeLabels[client.type]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="space-y-2 mb-4 text-sm">
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-phone text-gray-400 w-4"></i>
                                    <span>${client.phone}${client.phone2 ? `, ${client.phone2}` : ''}</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-envelope text-gray-400 w-4"></i>
                                    <span class="truncate">${client.email}</span>
                                </div>
                                ${client.rfc ? `
                                    <div class="flex items-center gap-2 text-gray-600">
                                        <i class="fas fa-id-card text-gray-400 w-4"></i>
                                        <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">${client.rfc}</span>
                                    </div>
                                ` : ''}
                                <div class="flex items-start gap-2 text-gray-600">
                                    <i class="fas fa-map-marker-alt text-gray-400 w-4 mt-0.5"></i>
                                    <span class="text-xs line-clamp-2">${formatAddress(client)}</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-indigo-600">${clientOrders.length}</p>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Pedidos</p>
                                </div>
                                <div class="text-center border-l border-gray-200">
                                    <p class="text-2xl font-bold text-green-600">${utils.formatCurrency(totalSpent)}</p>
                                    <p class="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                </div>
                            </div>

                            ${client.discount > 0 ? `
                                <div class="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <span class="text-sm text-green-700">
                                        <i class="fas fa-tag mr-1"></i>
                                        Descuento: <strong>${client.discount}%</strong>
                                    </span>
                                </div>
                            ` : ''}

                            <div class="flex gap-2">
                                <button onclick="views.viewClientHistory('${client.id}')" class="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                                    <i class="fas fa-history mr-1"></i>Historial
                                </button>
                                <button onclick="views.editClient('${client.id}')" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="views.showClientDetail('${client.id}')" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" title="Ver detalle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            },

            filterClients: () => {
                const search = document.getElementById('clientSearch').value.toLowerCase();
                let filtered = store.clients;
                if (search) {
                    filtered = filtered.filter(c => 
                        c.name.toLowerCase().includes(search) || 
                        c.phone?.includes(search) ||
                        c.email?.toLowerCase().includes(search) ||
                        c.rfc?.toLowerCase().includes(search)
                    );
                }
                const mode = 'cards';
                const grid = document.getElementById('clientsGrid');
                if (mode === 'list') {
                    grid.innerHTML = views.renderClientsList(filtered);
                } else {
                    grid.innerHTML = views.renderClientsGrid(filtered);
                }
            },

            finanzas: () => renderFinanzasView(),

            users: () => renderUsersAdminView(),

            designs: () => {
                return `
                    <div class="space-y-6 fade-in">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <input type="text" id="designSearch" placeholder="Buscar diseño..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-96" onkeyup="views.filterDesigns()">
                            <button onclick="views.showUploadDesign()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                <i class="fas fa-cloud-upload-alt mr-2"></i>Subir Diseño
                            </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" id="designsGrid">
                            ${views.renderDesignsGrid(store.designs)}
                        </div>
                    </div>
                `;
            },

            renderDesignsGrid: (designs) => {
                if (designs.length === 0) {
                    return '<div class="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300"><i class="fas fa-images text-4xl mb-3 text-gray-300"></i><p>No hay diseños guardados aún</p><p class="text-sm text-gray-400 mt-2">Haz clic en "Subir Diseño" para agregar</p></div>';
                }

                return designs.map(design => `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                        <div class="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            ${design.imageData ? 
                                `<img src="${design.imageData}" class="w-full h-full object-cover design-preview" alt="${design.name}">` :
                                `<i class="fas fa-image text-4xl text-gray-300"></i>`
                            }
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                <button onclick="views.viewDesignDetail('${design.id}')" class="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button onclick="views.deleteDesign('${design.id}')" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="p-3">
                            <p class="font-medium text-sm text-gray-800 truncate" title="${design.name}">${design.name}</p>
                            <p class="text-xs text-gray-500">${design.clientName || 'Sin cliente'}</p>
                            <p class="text-xs text-gray-400">${utils.formatDate(design.createdAt)}</p>
                        </div>
                    </div>
                `).join('');
            },

            filterDesigns: () => {
                const search = document.getElementById('designSearch').value.toLowerCase();
                let filtered = store.designs;
                if (search) {
                    filtered = filtered.filter(d => 
                        d.name.toLowerCase().includes(search) || 
                        d.clientName?.toLowerCase().includes(search)
                    );
                }
                document.getElementById('designsGrid').innerHTML = views.renderDesignsGrid(filtered);
            },

            viewDesignDetail: (designId) => {
                const design = store.designs.find(d => d.id === designId);
                if (!design) return;

                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">${design.name}</h2>
                                <p class="text-gray-500">Subido el ${utils.formatDate(design.createdAt)}</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="mb-6">
                            ${design.imageData ? 
                                `<img src="${design.imageData}" class="w-full max-h-96 object-contain rounded-lg border border-gray-200" alt="${design.name}">` :
                                '<div class="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg"><i class="fas fa-image text-6xl text-gray-300"></i></div>'
                            }
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Cliente asociado</p>
                                <p class="font-medium text-gray-900">${design.clientName || 'Ninguno'}</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Tamaño archivo</p>
                                <p class="font-medium text-gray-900">${design.fileSize || 'Desconocido'}</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-3">
                            <button onclick="views.useDesignInOrder('${design.id}')" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                                Usar en nuevo pedido
                            </button>
                            <button onclick="views.deleteDesign('${design.id}')" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                openModal();
            },

            deleteDesign: async (designId) => {
                if (!confirm('¿Eliminar este diseño permanentemente?')) return;
                
                try {
                    await supabaseData.deleteDesign(designId);
                    utils.notify('Diseño eliminado', 'success');
                    await supabaseData.loadAll();
                    router.refresh();
                } catch (error) {
                    console.error(error);
                    utils.notify('No se pudo eliminar el diseño: ' + (error.message || error), 'error');
                }
            },

            useDesignInOrder: (designId) => {
                const design = store.designs.find(d => d.id === designId);
                closeModal();
                showQuickOrder(design);
            },

            // NUEVO: Sistema profesional de creación de clientes
            showAddClient: () => {
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-4xl mx-auto">
                        <div class="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Nuevo Cliente</h2>
                                <p class="text-sm text-gray-500 mt-1">Complete la información del cliente para registrarlo en el sistema</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form id="clientForm" onsubmit="handleClientSubmit(event)" class="space-y-6">
                            <!-- Tipo de Cliente -->
                            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <label class="block text-sm font-semibold text-indigo-900 mb-3">Tipo de Cliente *</label>
                                <div class="grid grid-cols-3 gap-4">
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="menudeo" checked class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-user mb-1 block"></i>
                                            <span class="text-sm font-medium">Menudeo</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="frecuente" class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-star mb-1 block"></i>
                                            <span class="text-sm font-medium">Frecuente</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="mayoreo" class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-building mb-1 block"></i>
                                            <span class="text-sm font-medium">Mayoreo</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Información General -->
                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <i class="fas fa-id-card text-indigo-600"></i>
                                        Información General
                                    </h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo / Razón Social *</label>
                                        <input type="text" id="clientName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Ej: Juan Pérez García o Empresa S.A. de C.V." required>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal *</label>
                                            <input type="tel" id="clientPhone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="555-123-4567" required>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono Secundario</label>
                                            <input type="tel" id="clientPhone2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Opcional">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                                        <input type="email" id="clientEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="cliente@ejemplo.com" required>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Descuento Preferencial (%)</label>
                                        <div class="relative">
                                            <input type="number" id="clientDiscount" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 pr-8" value="0" min="0" max="100" step="0.5">
                                            <span class="absolute right-3 top-2 text-gray-500">%</span>
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">Descuento automático en cotizaciones y pedidos</p>
                                    </div>
                                </div>

                                <!-- Datos Fiscales -->
                                <div class="space-y-4" id="fiscalSection">
                                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <i class="fas fa-file-invoice text-indigo-600"></i>
                                        Datos Fiscales
                                        <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Opcional para facturación</span>
                                    </h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                                        <input type="text" id="clientRFC" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase" placeholder="XAXX010101000" maxlength="13" oninput="this.value = this.value.toUpperCase()">
                                        <p class="text-xs text-gray-500 mt-1">Registro Federal de Contribuyentes</p>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Régimen Fiscal</label>
                                        <select id="clientRegimen" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            <option value="">Seleccionar régimen...</option>
                                            <option value="601">601 - General de Ley Personas Morales</option>
                                            <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                                            <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                                            <option value="606">606 - Arrendamiento</option>
                                            <option value="608">608 - Demás ingresos</option>
                                            <option value="610">610 - Residentes en el Extranjero sin Establecimiento Permanente en México</option>
                                            <option value="611">611 - Ingresos por Dividendos (socios y accionistas)</option>
                                            <option value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</option>
                                            <option value="614">614 - Ingresos por intereses</option>
                                            <option value="616">616 - Sin obligaciones fiscales</option>
                                            <option value="620">620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos</option>
                                            <option value="621">621 - Incorporación Fiscal</option>
                                            <option value="622">622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                            <option value="623">623 - Opcional para Grupos de Sociedades</option>
                                            <option value="624">624 - Coordinados</option>
                                            <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                                            <option value="626">626 - Régimen Simplificado de Confianza</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Uso CFDI</label>
                                        <select id="clientUsoCFDI" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            <option value="G03">G03 - Gastos en general</option>
                                            <option value="G01">G01 - Adquisición de mercancías</option>
                                            <option value="G02">G02 - Devoluciones, descuentos o bonificaciones</option>
                                            <option value="I01">I01 - Construcciones</option>
                                            <option value="I02">I02 - Mobiliario y equipo de oficina por inversiones</option>
                                            <option value="I03">I03 - Equipo de transporte</option>
                                            <option value="I04">I04 - Equipo de cómputo y accesorios</option>
                                            <option value="I05">I05 - Dados, troqueles, moldes, matrices y herramental</option>
                                            <option value="I06">I06 - Comunicaciones telefónicas</option>
                                            <option value="I07">I07 - Comunicaciones satelitales</option>
                                            <option value="I08">I08 - Otra maquinaria y equipo</option>
                                            <option value="D01">D01 - Honorarios médicos, dentales y gastos hospitalarios</option>
                                            <option value="D02">D02 - Gastos médicos por incapacidad o discapacidad</option>
                                            <option value="D03">D03 - Gastos funerales</option>
                                            <option value="D04">D04 - Donativos</option>
                                            <option value="D05">D05 - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)</option>
                                            <option value="D06">D06 - Aportaciones voluntarias al SAR</option>
                                            <option value="D07">D07 - Primas por seguros de gastos médicos</option>
                                            <option value="D08">D08 - Gastos de transportación escolar obligatoria</option>
                                            <option value="D09">D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones</option>
                                            <option value="D10">D10 - Pagos por servicios educativos (colegiaturas)</option>
                                            <option value="S01">S01 - Sin efectos fiscales</option>
                                            <option value="CP01">CP01 - Pagos</option>
                                            <option value="CN01">CN01 - Nómina</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Dirección -->
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt text-indigo-600"></i>
                                    Dirección
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Calle y Número *</label>
                                        <input type="text" id="clientStreet" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Av. Insurgentes Sur 1234, Int. 502" required>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                                        <input type="text" id="clientColonia" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Del Valle" required>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                                        <input type="text" id="clientCP" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="03100" maxlength="5" required oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad / Municipio *</label>
                                        <input type="text" id="clientCity" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ciudad de México" required>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                                        <select id="clientState" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="AGU">Aguascalientes</option>
                                            <option value="BCN">Baja California</option>
                                            <option value="BCS">Baja California Sur</option>
                                            <option value="CAM">Campeche</option>
                                            <option value="CHP">Chiapas</option>
                                            <option value="CHH">Chihuahua</option>
                                            <option value="CMX">Ciudad de México</option>
                                            <option value="COA">Coahuila</option>
                                            <option value="COL">Colima</option>
                                            <option value="DUR">Durango</option>
                                            <option value="GUA">Guanajuato</option>
                                            <option value="GRO">Guerrero</option>
                                            <option value="HID">Hidalgo</option>
                                            <option value="JAL">Jalisco</option>
                                            <option value="MEX">Estado de México</option>
                                            <option value="MIC">Michoacán</option>
                                            <option value="MOR">Morelos</option>
                                            <option value="NAY">Nayarit</option>
                                            <option value="NLE">Nuevo León</option>
                                            <option value="OAX">Oaxaca</option>
                                            <option value="PUE">Puebla</option>
                                            <option value="QUE">Querétaro</option>
                                            <option value="ROO">Quintana Roo</option>
                                            <option value="SLP">San Luis Potosí</option>
                                            <option value="SIN">Sinaloa</option>
                                            <option value="SON">Sonora</option>
                                            <option value="TAB">Tabasco</option>
                                            <option value="TAM">Tamaulipas</option>
                                            <option value="TLA">Tlaxcala</option>
                                            <option value="VER">Veracruz</option>
                                            <option value="YUC">Yucatán</option>
                                            <option value="ZAC">Zacatecas</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Referencias / Entre calles</label>
                                    <textarea id="clientReferencias" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Entre calles, color de fachada, instrucciones de entrega..."></textarea>
                                </div>
                            </div>

                            <!-- Notas Adicionales -->
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <i class="fas fa-sticky-note text-indigo-600"></i>
                                    Notas Adicionales
                                </h3>
                                <textarea id="clientNotes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Información adicional sobre el cliente, preferencias, historial, etc..."></textarea>
                            </div>

                            <!-- Resumen y Acciones -->
                            <div class="border-t pt-6 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div class="text-sm text-gray-600">
                                        <p><i class="fas fa-info-circle text-indigo-600 mr-2"></i>Los campos marcados con * son obligatorios</p>
                                    </div>
                                    <div class="flex gap-3 w-full sm:w-auto">
                                        <button type="button" onclick="closeModal()" class="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-white text-gray-700 font-medium transition-colors">
                                            Cancelar
                                        </button>
                                        <button type="submit" class="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all">
                                            <i class="fas fa-save mr-2"></i>Guardar Cliente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
            },

            showClientDetail: (clientId) => {
                const client = store.clients.find(c => c.id === clientId);
                if (!client) return;

                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6 max-w-2xl">
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    ${client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-800">${client.name}</h2>
                                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                                        <i class="fas fa-${client.type === 'mayoreo' ? 'building' : client.type === 'frecuente' ? 'star' : 'user'}"></i>
                                        ${client.type === 'menudeo' ? 'Menudeo' : client.type === 'mayoreo' ? 'Mayoreo' : 'Cliente Frecuente'}
                                    </span>
                                </div>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div class="space-y-6">
                            <!-- Información de Contacto -->
                            <div class="bg-gray-50 p-4 rounded-xl">
                                <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-address-card text-indigo-600"></i>
                                    Información de Contacto
                                </h3>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p class="text-gray-500">Teléfono Principal</p>
                                        <p class="font-medium text-gray-800">${client.phone || 'No registrado'}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-500">Teléfono Secundario</p>
                                        <p class="font-medium text-gray-800">${client.phone2 || 'No registrado'}</p>
                                    </div>
                                    <div class="col-span-2">
                                        <p class="text-gray-500">Correo Electrónico</p>
                                        <p class="font-medium text-gray-800">${client.email || 'No registrado'}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Datos Fiscales -->
                            ${client.rfc ? `
                                <div class="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <i class="fas fa-file-invoice text-green-600"></i>
                                        Datos Fiscales
                                    </h3>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p class="text-gray-500">RFC</p>
                                            <p class="font-mono font-medium text-gray-800 text-lg">${client.rfc}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">Régimen Fiscal</p>
                                            <p class="font-medium text-gray-800">${client.regimenFiscal || 'No especificado'}</p>
                                        </div>
                                        <div class="col-span-2">
                                            <p class="text-gray-500">Uso CFDI</p>
                                            <p class="font-medium text-gray-800">${client.usoCFDI || 'G03 - Gastos en general'}</p>
                                        </div>
                                    </div>
                                </div>
                            ` : '<div class="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm"><i class="fas fa-exclamation-triangle mr-2"></i>Este cliente no tiene datos fiscales registrados</div>'}

                            <!-- Dirección -->
                            <div class="bg-gray-50 p-4 rounded-xl">
                                <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt text-indigo-600"></i>
                                    Dirección
                                </h3>
                                <div class="text-sm space-y-1">
                                    <p class="font-medium text-gray-800">${client.address?.street || 'No registrada'}</p>
                                    <p class="text-gray-600">${client.address?.colonia || ''}</p>
                                    <p class="text-gray-600">${client.address?.cp ? `C.P. ${client.address.cp}` : ''} ${client.address?.city || ''}</p>
                                    <p class="text-gray-600">${client.address?.state || ''}</p>
                                    ${client.address?.referencias ? `<p class="text-gray-500 mt-2 italic">Ref: ${client.address.referencias}</p>` : ''}
                                </div>
                            </div>

                            <!-- Notas -->
                            ${client.notes ? `
                                <div class="bg-gray-50 p-4 rounded-xl">
                                    <h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <i class="fas fa-sticky-note text-indigo-600"></i>
                                        Notas
                                    </h3>
                                    <p class="text-sm text-gray-600">${client.notes}</p>
                                </div>
                            ` : ''}

                            <!-- Estadísticas -->
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-center p-4 bg-indigo-50 rounded-xl">
                                    <p class="text-2xl font-bold text-indigo-600">${store.orders.filter(o => o.clientId === client.id).length}</p>
                                    <p class="text-xs text-gray-600">Pedidos realizados</p>
                                </div>
                                <div class="text-center p-4 bg-green-50 rounded-xl">
                                    <p class="text-2xl font-bold text-green-600">${utils.formatCurrency(store.orders.filter(o => o.clientId === client.id).reduce((a, b) => a + (b.total || 0), 0))}</p>
                                    <p class="text-xs text-gray-600">Total comprado</p>
                                </div>
                                <div class="text-center p-4 bg-purple-50 rounded-xl">
                                    <p class="text-2xl font-bold text-purple-600">${client.discount || 0}%</p>
                                    <p class="text-xs text-gray-600">Descuento asignado</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 mt-6 pt-4 border-t">
                            <button onclick="views.viewClientHistory('${client.id}')" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                <i class="fas fa-history mr-2"></i>Ver Historial
                            </button>
                            <button onclick="views.editClient('${client.id}')" class="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <i class="fas fa-edit mr-2"></i>Editar
                            </button>
                        </div>
                    </div>
                `;
                openModal();
            },

            viewClientHistory: (clientId) => {
                const client = store.clients.find(c => c.id === clientId);
                const orders = store.orders.filter(o => o.clientId === clientId);
                
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">${client.name}</h2>
                                <p class="text-gray-500">Historial completo</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            ${orders.length === 0 ? '<p class="text-gray-500 text-center py-8">Sin pedidos registrados</p>' : 
                                orders.map(order => `
                                    <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div class="flex justify-between items-start mb-2">
                                            <span class="font-bold text-indigo-600">#${order.id.substr(-6)}</span>
                                            <span class="text-sm text-gray-500">${utils.formatDate(order.createdAt)}</span>
                                        </div>
                                        <p class="text-sm text-gray-600 mb-2">${order.description || 'Sin descripción'}</p>
                                        <div class="flex justify-between items-center">
                                            <span class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 capitalize">${order.status}</span>
                                            <span class="font-bold text-gray-800">${utils.formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>
                `;
                openModal();
            },

            editClient: (clientId) => {
                const client = store.clients.find(c => c.id === clientId);
                if (!client) return;
                const modal = document.getElementById('modal-content');
                // Reutilizamos el mismo HTML de showAddClient pero pre-rellenado
                modal.innerHTML = `
                    <div class="p-6 max-w-4xl mx-auto">
                        <div class="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Editar Cliente</h2>
                                <p class="text-sm text-gray-500 mt-1">Modifica los datos del cliente y guarda los cambios</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <form id="clientForm" onsubmit="handleClientUpdate(event, '${client.id}')" class="space-y-6">
                            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <label class="block text-sm font-semibold text-indigo-900 mb-3">Tipo de Cliente *</label>
                                <div class="grid grid-cols-3 gap-4">
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="menudeo" ${client.type==='menudeo'?'checked':''} class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-user mb-1 block"></i>
                                            <span class="text-sm font-medium">Menudeo</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="frecuente" ${client.type==='frecuente'?'checked':''} class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-star mb-1 block"></i>
                                            <span class="text-sm font-medium">Frecuente</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="clientType" value="mayoreo" ${client.type==='mayoreo'?'checked':''} class="peer sr-only" onchange="toggleFiscalFields()">
                                        <div class="p-3 rounded-lg border-2 border-gray-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white transition-all text-center">
                                            <i class="fas fa-building mb-1 block"></i>
                                            <span class="text-sm font-medium">Mayoreo</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2"><i class="fas fa-id-card text-indigo-600"></i> Información General</h3>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label><input type="text" id="clientName" value="${client.name}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input type="tel" id="clientPhone" value="${client.phone||''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Teléfono 2</label><input type="tel" id="clientPhone2" value="${client.phone2||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    </div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" id="clientEmail" value="${client.email||''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Descuento especial</label><div class="relative"><input type="number" id="clientDiscount" value="${client.discount||0}" min="0" max="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 pr-8"><span class="absolute right-3 top-2 text-gray-500">%</span></div></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Notas</label><textarea id="clientNotes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">${client.notes||''}</textarea></div>
                                </div>
                                <div class="space-y-4" id="fiscalSection">
                                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2"><i class="fas fa-file-invoice text-indigo-600"></i> Datos Fiscales <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Opcional</span></h3>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">RFC</label><input type="text" id="clientRFC" value="${client.rfc||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase" maxlength="13" oninput="this.value=this.value.toUpperCase()"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Régimen Fiscal</label>
                                        <select id="clientRegimen" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            <option value="">Seleccionar régimen...</option>
                                            ${['601','603','605','606','608','612','616','621','626'].map(v=>`<option value="${v}" ${client.regimenFiscal===v?'selected':''}>${v}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Uso CFDI</label>
                                        <select id="clientUsoCFDI" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            ${['G03','G01','G02','I01','S01','CP01','CN01'].map(v=>`<option value="${v}" ${client.usoCFDI===v?'selected':''}>${v}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-map-marker-alt text-indigo-600"></i> Dirección</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Calle y Número</label><input type="text" id="clientStreet" value="${client.address?.street||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Colonia</label><input type="text" id="clientColonia" value="${client.address?.colonia||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label><input type="text" id="clientCP" value="${client.address?.cp||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" maxlength="5"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label><input type="text" id="clientCity" value="${client.address?.city||''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></div>
                                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <select id="clientState" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            ${['AGU','BCN','BCS','CAM','CHP','CHH','CMX','COA','COL','DUR','GUA','GRO','HID','JAL','MEX','MIC','MOR','NAY','NLE','OAX','PUE','QUE','ROO','SLP','SIN','SON','TAB','TAM','TLA','VER','YUC','ZAC'].map(s=>`<option value="${s}" ${client.address?.state===s?'selected':''}>${s}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-3 pt-4 border-t">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                                <button type="button" onclick="confirmDeleteClient('${client.id}')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                    <i class="fas fa-trash mr-1"></i> Eliminar
                                </button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                    <i class="fas fa-save mr-2"></i>Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
            },

            editOrder: (orderId) => {
                const order = store.orders.find(o => o.id === orderId);
                if (!order) return;
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Editar Pedido <span class="text-indigo-600">#${order.id.substr(-6)}</span></h2>
                                <p class="text-sm text-gray-500 mt-1">Modifica los datos del pedido</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                        </div>
                        <form onsubmit="handleOrderUpdate(event, '${order.id}')" class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                    <select id="editOrderClient" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                        ${store.clients.map(c=>`<option value="${c.id}" ${c.id===order.clientId?'selected':''}>${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select id="editOrderStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                        <option value="recibido" ${order.status==='recibido'?'selected':''}>Recibido</option>
                                        <option value="diseno" ${order.status==='diseno'?'selected':''}>En Diseño</option>
                                        <option value="impresion" ${order.status==='impresion'?'selected':''}>En Impresión</option>
                                        <option value="terminado" ${order.status==='terminado'?'selected':''}>Terminado</option>
                                        <option value="entregado" ${order.status==='entregado'?'selected':''}>Entregado</option>
                                        <option value="cancelado" ${order.status==='cancelado'?'selected':''}>Cancelado</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de entrega</label>
                                    <select id="editDeliveryType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onchange="toggleEditDeliveryAddress()">
                                        <option value="local" ${order.deliveryType==='local'?'selected':''}>Entrega en local</option>
                                        <option value="pickup" ${order.deliveryType==='pickup'?'selected':''}>Recoge cliente</option>
                                        <option value="shipping" ${order.deliveryType==='shipping'?'selected':''}>Envío por paquetería</option>
                                    </select>
                                </div>
                                <div id="editDeliveryAddressWrap" class="${order.deliveryType==='shipping'?'':'hidden'}">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
                                    <textarea id="editDeliveryAddress" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">${order.deliveryAddress||''}</textarea>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="editPartialDelivery" ${order.partialDelivery?'checked':''} class="w-4 h-4 text-indigo-600 rounded">
                                <label for="editPartialDelivery" class="text-sm text-gray-700">Entrega parcial</label>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-3">
                                    <h3 class="font-semibold text-gray-800">Artículos</h3>
                                    <button type="button" onclick="addEditOrderItem()" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"><i class="fas fa-plus mr-1"></i>Agregar</button>
                                </div>
                                <div id="editOrderItems" class="space-y-3">
                                    ${(order.items||[]).map((item,i)=>`
                                        <div class="edit-order-item bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div class="grid grid-cols-12 gap-2 items-end">
                                                <div class="col-span-4">
                                                    <label class="block text-xs text-gray-600 mb-1">Producto</label>
                                                    <select class="edit-item-product w-full px-2 py-2 border border-gray-300 rounded text-sm" onchange="onEditProductSelect(this)">
                                                        ${getProductOptions().replace(`value="${item.productId}"`, `value="${item.productId}" selected`)}
                                                    </select>
                                                </div>
                                                <div class="col-span-3">
                                                    <label class="block text-xs text-gray-600 mb-1">Descripción</label>
                                                    <input type="text" class="edit-item-desc w-full px-2 py-2 border border-gray-300 rounded text-sm" value="${item.description||''}">
                                                </div>
                                                <div class="col-span-2">
                                                    <label class="block text-xs text-gray-600 mb-1">Cantidad</label>
                                                    <div class="flex items-center gap-1">
                                                        <input type="number" class="edit-item-qty w-full px-2 py-2 border border-gray-300 rounded text-sm" value="${item.quantity}" min="0.01" step="0.01" onchange="calculateEditOrderTotal()">
                                                    </div>
                                                </div>
                                                <div class="col-span-2">
                                                    <label class="block text-xs text-gray-600 mb-1">Precio unit.</label>
                                                    <input type="number" class="edit-item-price w-full px-2 py-2 border border-gray-300 rounded text-sm" value="${item.price}" min="0" step="0.01" onchange="calculateEditOrderTotal()">
                                                </div>
                                                <div class="col-span-1">
                                                    <button type="button" onclick="this.closest('.edit-order-item').remove(); calculateEditOrderTotal()" class="text-red-500 hover:text-red-700 p-2 w-full"><i class="fas fa-trash text-xs"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Notas / Especificaciones</label>
                                <textarea id="editOrderNotes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">${order.description||''}</textarea>
                            </div>
                            <div class="border-t pt-4 flex justify-between items-center">
                                <div class="text-lg font-bold text-gray-800">Total: <span id="editOrderTotal" class="text-indigo-600">${utils.formatCurrency(order.total)}</span></div>
                                <input type="hidden" id="editOrderTotalInput" value="${order.total}">
                            </div>
                            <div class="flex gap-3">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                                <button type="button" onclick="confirmDeleteOrder('${order.id}')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                    <i class="fas fa-trash mr-1"></i> Eliminar
                                </button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                    <i class="fas fa-save mr-2"></i>Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
                calculateEditOrderTotal();
            },

            printOrder: (id) => {
                utils.notify('Imprimiendo orden...', 'success');
                setTimeout(() => window.print(), 500);
            },

            viewQuoteDetail: (id) => {
                const quote = store.quotes.find(q => q.id === id);
                if (!quote) return;

                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">Cotización #${quote.id.substr(-4)}</h2>
                                <p class="text-gray-500">Creada el ${utils.formatDate(quote.createdAt)}</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Cliente</p>
                                <p class="font-medium text-gray-900">${quote.clientName}</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Producto</p>
                                <p class="font-medium text-gray-900">${quote.productName || 'No especificado'}</p>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <p class="text-2xl font-bold text-indigo-600">${quote.qty}</p>
                                    <p class="text-xs text-gray-500">Piezas</p>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <p class="text-2xl font-bold text-indigo-600 capitalize">${quote.size}</p>
                                    <p class="text-xs text-gray-500">Tamaño</p>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <p class="text-2xl font-bold text-indigo-600">${quote.colors}</p>
                                    <p class="text-xs text-gray-500">Colores</p>
                                </div>
                            </div>
                            <div class="bg-indigo-50 p-4 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <span class="font-semibold text-indigo-900">Total:</span>
                                    <span class="text-3xl font-bold text-indigo-600">${utils.formatCurrency(quote.total)}</span>
                                </div>
                            </div>
                            ${quote.notes ? `
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p class="text-sm text-gray-600">Notas:</p>
                                    <p class="text-gray-900">${quote.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${!quote.convertedToOrder ? `
                            <div class="mt-6">
                                <button onclick="quoteToOrder('${quote.id}'); closeModal();" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
                                    Convertir a Pedido
                                </button>
                            </div>
                        ` : `
                            <div class="mt-6 text-center text-gray-500">
                                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                                Esta cotización ya fue convertida a pedido
                            </div>
                        `}
                    </div>
                `;
                openModal();
            },

            showUploadDesign: () => {
                const modal = document.getElementById('modal-content');
                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Subir Nuevo Diseño</h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form id="uploadDesignForm" onsubmit="handleDesignUpload(event)" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del diseño *</label>
                                <input type="text" id="designName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Logo Empresa XYZ" required>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cliente asociado</label>
                                <select id="designClient" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Sin cliente específico</option>
                                    ${store.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Opcional: asocia este diseño a un cliente</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Archivo del diseño *</label>
                                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer" onclick="document.getElementById('designFile').click()">
                                    <input type="file" id="designFile" class="hidden" accept="image/*,.pdf,.ai,.psd,.eps" onchange="previewDesignFile(this)" required>
                                    <div id="filePreviewArea">
                                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                                        <p class="text-gray-600">Haz clic para seleccionar archivo</p>
                                        <p class="text-sm text-gray-400 mt-1">PNG, JPG, PDF, AI, PSD, EPS</p>
                                    </div>
                                    <div id="imagePreview" class="hidden mt-4">
                                        <img id="previewImg" class="max-h-48 mx-auto rounded-lg shadow-md">
                                        <p id="fileName" class="text-sm text-gray-600 mt-2"></p>
                                        <p id="fileSize" class="text-xs text-gray-400"></p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Notas / Descripción</label>
                                <textarea id="designNotes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Colores específicos, dimensiones, etc..."></textarea>
                            </div>

                            <div class="flex gap-3 pt-4">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                    <i class="fas fa-upload mr-2"></i>Subir Diseño
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
            }
        };

        // ============================================================
        // NUEVO: Funciones de control de tabs de inventario
        // ============================================================
        
        function switchInventoryTab(tab) {
            // Actualizar tabs
            document.querySelectorAll('.inventory-tab').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${tab}`).classList.add('active');
            
            // Mostrar contenido correspondiente
            document.querySelectorAll('[id^="inventory-content-"]').forEach(c => c.classList.add('hidden'));
            document.getElementById(`inventory-content-${tab}`).classList.remove('hidden');
            
            // Guardar preferencia
            
        }

        function filterSupplies() {
            const search = document.getElementById('supplySearch')?.value.toLowerCase() || '';
            const category = document.getElementById('supplyCategory')?.value || '';
            
            let filtered = store.supplies;
            if (search) {
                filtered = filtered.filter(s => 
                    s.name.toLowerCase().includes(search) || 
                    s.description?.toLowerCase().includes(search)
                );
            }
            if (category) {
                filtered = filtered.filter(s => s.category === category);
            }
            
            const tbody = document.getElementById('suppliesTableBody');
            if (tbody) tbody.innerHTML = views.renderSuppliesTable(filtered);
        }

        function filterProducts() {
            const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
            const category = document.getElementById('productCategory')?.value || '';
            
            let filtered = store.products;
            if (search) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(search) || 
                    p.sku?.toLowerCase().includes(search) ||
                    p.description?.toLowerCase().includes(search)
                );
            }
            if (category) {
                filtered = filtered.filter(p => p.category === category);
            }
            
            const tbody = document.getElementById('productsTableBody');
            if (tbody) tbody.innerHTML = views.renderProductsTable(filtered);
        }

        function toggleNewCategoryInput(type) {
            const sel = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}Category`);
            const wrap = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}CategoryInput`);
            if (!sel || !wrap) return;
            if (sel.value === '__new__') {
                wrap.classList.remove('hidden');
                const inp = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}CategoryName`);
                if (inp) inp.focus();
            } else {
                wrap.classList.add('hidden');
            }
        }

        function updateSubcategories(type) {
            const categorySelect = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}Category`);
            const subcategorySelect = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}Subcategory`);
            
            if (!categorySelect || !subcategorySelect) return;
            
            const categoryKey = categorySelect.value;
            const categories = type === 'supply' ? store.categories.supplies : store.categories.products;
            const category = categories[categoryKey];
            
            subcategorySelect.innerHTML = '<option value="">Seleccionar...</option>';
            
            if (category && category.subcategories) {
                Object.entries(category.subcategories).forEach(([key, name]) => {
                    subcategorySelect.innerHTML += `<option value="${key}">${name}</option>`;
                });
            }
        }

        async function handleAddSupply(e) {
            e.preventDefault();
            
            const supply = {
                id: 'sup_' + Date.now(),
                name: document.getElementById('newSupplyName').value,
                description: document.getElementById('newSupplyDescription').value,
                category: document.getElementById('newSupplyCategory').value,
                subcategory: document.getElementById('newSupplySubcategory').value,
                type: 'supply',
                stock: parseInt(document.getElementById('newSupplyStock').value) || 0,
                minStock: parseInt(document.getElementById('newSupplyMinStock').value) || 5,
                unit: document.getElementById('newSupplyUnit').value,
                cost: parseFloat(document.getElementById('newSupplyCost').value) || 0,
                location: document.getElementById('newSupplyLocation').value,
                supplier: 'Por definir',
                lastRestocked: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            
            try {
                await supabaseData.saveSupply(supply);
                utils.notify('Insumo agregado correctamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo guardar el insumo: ' + (error.message || error), 'error');
            }
        }

        async function handleAddProduct(e) {
            e.preventDefault();
            
            let categoryKey = document.getElementById('newProductCategory').value;
            
            // Manejar nueva categoría
            if (categoryKey === '__new__') {
                const newCatName = document.getElementById('newProductCategoryName').value.trim();
                if (!newCatName) {
                    utils.notify('Escribe el nombre de la nueva categoría', 'error');
                    return;
                }
                categoryKey = newCatName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                if (!store.categories.products[categoryKey]) {
                    store.categories.products[categoryKey] = {
                        name: newCatName,
                        color: '#6366f1',
                        subcategories: {}
                    };
                }
            }
            
            const name = document.getElementById('newProductName').value.trim();
            // Auto-generar SKU: primeras 3 letras de categoría + primeras 3 del nombre + timestamp corto
            const catPrefix = categoryKey.substring(0, 3).toUpperCase();
            const namePrefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
            const autoSku = `${catPrefix}-${namePrefix}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
            
            const product = {
                id: 'prod_' + Date.now(),
                name: name,
                sku: autoSku,
                description: document.getElementById('newProductDescription').value,
                category: categoryKey,
                subcategory: document.getElementById('newProductSubcategory').value,
                type: 'product',
                stock: parseFloat(document.getElementById('newProductStock').value) || 0,
                minStock: parseFloat(document.getElementById('newProductMinStock').value) || 10,
                unit: document.getElementById('newProductUnit').value,
                cost: parseFloat(document.getElementById('newProductCost').value) || 0,
                salePrice: parseFloat(document.getElementById('newProductSalePrice').value) || 0,
                supplier: 'Por definir',
                location: 'Por definir',
                createdAt: new Date().toISOString()
            };
            
            try {
                await supabaseData.saveProduct(product);
                utils.notify('Producto agregado correctamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo guardar el producto: ' + (error.message || error), 'error');
            }
        }

        // ============================================================
        // Panel de migración
        // ============================================================
        
        function toggleMigrationPanel() {
            const panel = document.getElementById('migrationPanel');
            panel.classList.toggle('open');
        }

        // ============================================================
        // MÓDULO DE FINANZAS — vista standalone (evita backtick anidado)
        // ============================================================

        function renderUsersAdminView() {
            setTimeout(() => usersAdmin.load(), 0);
            return `
                <div class="space-y-6 fade-in">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">Administración de usuarios</h2>
                                <p class="text-sm text-gray-500 mt-1">Administra nombres y roles. Solo los administradores pueden ver este módulo.</p>
                            </div>
                            <button onclick="usersAdmin.load()" class="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                <i class="fas fa-sync-alt"></i> Actualizar
                            </button>
                        </div>
                        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                            <div class="xl:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-gray-800">Crear usuario</h3>
                                        <p class="text-xs text-gray-500">Administrador o usuario general</p>
                                    </div>
                                </div>
                                <form id="create-user-form" class="space-y-3" onsubmit="usersAdmin.create(event)">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1">Nombre completo</label>
                                        <input id="create-user-fullname" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Nombre del usuario" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1">Correo</label>
                                        <input id="create-user-email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="usuario@correo.com" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1">Contraseña temporal</label>
                                        <input id="create-user-password" type="password" minlength="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Mínimo 6 caracteres" required>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
                                        <select id="create-user-role" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                            <option value="usuario">Usuario general</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                    </div>
                                    <button id="create-user-submit" type="submit" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                                        <i class="fas fa-user-plus"></i> Crear usuario
                                    </button>
                                    <div id="create-user-status" class="hidden text-xs rounded-lg p-3"></div>
                                </form>
                            </div>
                            <div class="xl:col-span-2 rounded-2xl bg-blue-50 border border-blue-100 p-5 text-sm text-blue-800">
                                <h3 class="font-bold mb-2"><i class="fas fa-info-circle mr-2"></i>Importante</h3>
                                <p>Para crear usuarios desde la app se usa una <strong>Edge Function</strong> de Supabase llamada <strong>create-user</strong>. Esto evita exponer la llave <strong>service_role</strong> en el navegador.</p>
                                <p class="mt-2">Si al crear usuario aparece error de función no encontrada, sube la carpeta <strong>supabase/functions/create-user</strong> con Supabase CLI.</p>
                            </div>
                        </div>
                        <div id="users-admin-status" class="text-sm text-gray-500 py-4">Cargando usuarios...</div>
                        <div class="overflow-x-auto hidden" id="users-admin-table-wrap">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Correo</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Nombre</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Rol</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-600">Último acceso</th>
                                        <th class="px-4 py-3 text-center font-semibold text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="users-admin-tbody" class="divide-y divide-gray-100"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }

        const usersAdmin = {
            users: [],
            safe(value) {
                if (window.security && typeof security.cleanText === 'function') return security.cleanText(value);
                return String(value || '').replace(/[<>&"']/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[ch])).trim();
            },
            async load() {
                const status = document.getElementById('users-admin-status');
                const wrap = document.getElementById('users-admin-table-wrap');
                const tbody = document.getElementById('users-admin-tbody');
                if (!status || !tbody) return;

                if (!window.auth || auth.role !== 'administrador') {
                    status.textContent = 'No tienes permiso para ver este módulo.';
                    status.className = 'text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-4';
                    wrap?.classList.add('hidden');
                    return;
                }

                status.textContent = 'Cargando usuarios...';
                status.className = 'text-sm text-gray-500 py-4';
                wrap?.classList.add('hidden');

                const { data, error } = await supabaseClient.rpc('admin_list_users');
                if (error) {
                    status.textContent = 'No se pudieron cargar usuarios: ' + error.message;
                    status.className = 'text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-4';
                    return;
                }

                this.users = Array.isArray(data) ? data : [];
                tbody.innerHTML = this.users.map(user => this.renderRow(user)).join('');
                status.textContent = this.users.length ? `${this.users.length} usuario(s) encontrado(s).` : 'No hay usuarios registrados.';
                status.className = 'text-sm text-gray-500 mb-3';
                if (this.users.length) wrap?.classList.remove('hidden');
            },
            renderRow(user) {
                const id = this.safe(user.id);
                const email = this.safe(user.email || 'Sin correo');
                const fullName = this.safe(user.full_name || '');
                const role = ['administrador', 'usuario'].includes(user.role) ? user.role : 'usuario';
                const lastAccess = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('es-MX') : 'Sin acceso registrado';
                const isCurrent = window.auth?.user?.id === user.id;
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3">
                            <div class="font-medium text-gray-800">${email}</div>
                            ${isCurrent ? '<div class="text-xs text-indigo-600 mt-1">Tu sesión actual</div>' : ''}
                        </td>
                        <td class="px-4 py-3">
                            <input id="user-name-${id}" value="${fullName}" class="w-full min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Nombre completo">
                        </td>
                        <td class="px-4 py-3">
                            <select id="user-role-${id}" class="w-full min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" ${isCurrent ? 'title="No cambies tu propio rol desde tu sesión actual"' : ''}>
                                <option value="usuario" ${role === 'usuario' ? 'selected' : ''}>Usuario general</option>
                                <option value="administrador" ${role === 'administrador' ? 'selected' : ''}>Administrador</option>
                            </select>
                        </td>
                        <td class="px-4 py-3 text-gray-500 whitespace-nowrap">${this.safe(lastAccess)}</td>
                        <td class="px-4 py-3 text-center">
                            <button onclick="usersAdmin.save('${id}')" class="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                                <i class="fas fa-save"></i> Guardar
                            </button>
                        </td>
                    </tr>
                `;
            },
            async create(event) {
                if (event) event.preventDefault();
                if (!window.auth || auth.role !== 'administrador') {
                    utils.notify('No tienes permiso para crear usuarios', 'error');
                    return;
                }

                const fullName = this.safe(document.getElementById('create-user-fullname')?.value || 'Usuario');
                const email = this.safe(document.getElementById('create-user-email')?.value || '').toLowerCase();
                const password = document.getElementById('create-user-password')?.value || '';
                const role = document.getElementById('create-user-role')?.value === 'administrador' ? 'administrador' : 'usuario';
                const btn = document.getElementById('create-user-submit');
                const statusBox = document.getElementById('create-user-status');

                if (!fullName || !email || password.length < 6) {
                    this.showCreateStatus('Captura nombre, correo y una contraseña temporal de mínimo 6 caracteres.', 'error');
                    return;
                }

                const { data: sessionData } = await supabaseClient.auth.getSession();
                const token = sessionData?.session?.access_token;
                if (!token) {
                    this.showCreateStatus('Tu sesión expiró. Cierra sesión e inicia de nuevo.', 'error');
                    return;
                }

                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
                }

                try {
                    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ email, password, full_name: fullName, role })
                    });
                    const result = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(result.error || 'No se pudo crear el usuario.');
                    }
                    this.showCreateStatus('Usuario creado correctamente.', 'success');
                    document.getElementById('create-user-form')?.reset();
                    await this.load();
                    utils.notify('Usuario creado correctamente');
                } catch (error) {
                    this.showCreateStatus(error.message || 'Error al crear usuario.', 'error');
                    utils.notify(error.message || 'Error al crear usuario', 'error');
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear usuario';
                    }
                }
            },
            showCreateStatus(message, type = 'success') {
                const box = document.getElementById('create-user-status');
                if (!box) return;
                box.textContent = this.safe(message);
                box.className = type === 'error'
                    ? 'text-xs rounded-lg p-3 bg-red-50 border border-red-100 text-red-700'
                    : 'text-xs rounded-lg p-3 bg-emerald-50 border border-emerald-100 text-emerald-700';
                box.classList.remove('hidden');
            },

            async save(id) {
                const nameEl = document.getElementById(`user-name-${id}`);
                const roleEl = document.getElementById(`user-role-${id}`);
                const fullName = this.safe(nameEl?.value || 'Usuario');
                const role = roleEl?.value === 'administrador' ? 'administrador' : 'usuario';

                const { error } = await supabaseClient.rpc('admin_update_user_profile', {
                    p_target_id: id,
                    p_full_name: fullName,
                    p_role: role
                });

                if (error) {
                    utils.notify('No se pudo actualizar usuario: ' + error.message, 'error');
                    return;
                }

                utils.notify('Usuario actualizado correctamente');
                await this.load();

                if (window.auth?.user?.id === id) {
                    await auth.loadProfile();
                    auth.applyRoleUI();
                }
            }
        };


        // Exponer módulo de usuarios al navegador para botones inline.
        window.usersAdmin = usersAdmin;

        function renderFinanzasView() {
            const now = new Date();
            const mesActual = now.getMonth();
            const anioActual = now.getFullYear();
            const movs = store.finanzas;

            const del_mes = movs.filter(function(m) {
                var d = new Date(m.fecha);
                return d.getMonth() === mesActual && d.getFullYear() === anioActual;
            });

            const totalVentas        = del_mes.filter(function(m){ return m.tipo==='venta'; }).reduce(function(a,m){ return a+m.monto; }, 0);
            const totalGastosInsumos = del_mes.filter(function(m){ return m.tipo==='gasto_insumo'; }).reduce(function(a,m){ return a+m.monto; }, 0);
            const totalGastosOp      = del_mes.filter(function(m){ return m.tipo==='gasto_operativo'; }).reduce(function(a,m){ return a+m.monto; }, 0);
            const utilidad = totalVentas - totalGastosInsumos - totalGastosOp;

            const tipoFiltro = '';
            const mesFiltro  = '';
            let filtrados = movs.slice();
            if (tipoFiltro) filtrados = filtrados.filter(function(m){ return m.tipo === tipoFiltro; });
            if (mesFiltro)  filtrados = filtrados.filter(function(m){ return m.fecha && m.fecha.startsWith(mesFiltro); });
            filtrados.sort(function(a,b){ return new Date(b.fecha) - new Date(a.fecha); });

            const tipoLabel = { venta: 'Venta', gasto_insumo: 'Gasto Insumo', gasto_operativo: 'Gasto Operativo' };
            const tipoBadge = { venta: 'bg-green-100 text-green-700', gasto_insumo: 'bg-purple-100 text-purple-700', gasto_operativo: 'bg-orange-100 text-orange-700' };

            const utilClase  = utilidad >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
            const utilIcono  = utilidad >= 0 ? 'bg-green-200 text-green-700'  : 'bg-red-200 text-red-700';
            const utilTexto  = utilidad >= 0 ? 'text-green-700'               : 'text-red-600';

            // Rows de tabla desktop
            var rowsDesktop = '';
            if (filtrados.length === 0) {
                rowsDesktop = '<tr><td colspan="7" class="px-5 py-10 text-center text-gray-400"><i class="fas fa-folder-open text-3xl mb-2 block"></i>Sin movimientos registrados</td></tr>';
            } else {
                filtrados.forEach(function(m) {
                    var badge  = tipoBadge[m.tipo] || 'bg-gray-100 text-gray-600';
                    var label  = tipoLabel[m.tipo] || m.tipo;
                    var color  = m.tipo === 'venta' ? 'text-green-600' : 'text-red-500';
                    var signo  = m.tipo === 'venta' ? '+' : '-';
                    var pedido = m.pedidoRef ? '#' + m.pedidoRef : '—';
                    rowsDesktop += '<tr class="hover:bg-gray-50 transition-colors">'
                        + '<td class="px-5 py-4 text-sm text-gray-600">' + utils.formatDate(m.fecha) + '</td>'
                        + '<td class="px-5 py-4"><span class="px-2 py-1 rounded-full text-xs font-medium ' + badge + '">' + label + '</span></td>'
                        + '<td class="px-5 py-4 text-sm font-medium text-gray-800">' + m.concepto + '</td>'
                        + '<td class="px-5 py-4 text-sm text-gray-500">' + (m.categoria || '—') + '</td>'
                        + '<td class="px-5 py-4 text-sm text-gray-500">' + pedido + '</td>'
                        + '<td class="px-5 py-4 text-right font-semibold ' + color + '">' + signo + utils.formatCurrency(m.monto) + '</td>'
                        + '<td class="px-5 py-4 text-center"><button onclick="finanzas.deleteMovimiento(\'' + m.id + '\')" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><i class="fas fa-trash text-sm"></i></button></td>'
                        + '</tr>';
                });
            }

            // Cards mobile
            var cardsMobile = '';
            if (filtrados.length === 0) {
                cardsMobile = '<div class="py-12 text-center text-gray-400"><i class="fas fa-folder-open text-3xl mb-2 block"></i>Sin movimientos</div>';
            } else {
                filtrados.forEach(function(m) {
                    var badge  = tipoBadge[m.tipo] || 'bg-gray-100 text-gray-600';
                    var label  = tipoLabel[m.tipo] || m.tipo;
                    var color  = m.tipo === 'venta' ? 'text-green-600' : 'text-red-500';
                    var signo  = m.tipo === 'venta' ? '+' : '-';
                    var pedRef = m.pedidoRef ? '<span class="text-xs text-gray-400">#' + m.pedidoRef + '</span>' : '';
                    cardsMobile += '<div class="p-4 hover:bg-gray-50 transition-colors">'
                        + '<div class="flex justify-between items-start mb-2">'
                        + '<div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full text-xs font-medium ' + badge + '">' + label + '</span>' + pedRef + '</div>'
                        + '<span class="font-bold ' + color + '">' + signo + utils.formatCurrency(m.monto) + '</span>'
                        + '</div>'
                        + '<p class="font-medium text-sm text-gray-800">' + m.concepto + '</p>'
                        + '<div class="flex justify-between items-center mt-1">'
                        + '<span class="text-xs text-gray-400">' + utils.formatDate(m.fecha) + ' · ' + (m.categoria || '—') + '</span>'
                        + '<button onclick="finanzas.deleteMovimiento(\'' + m.id + '\')" class="p-1 text-red-400 hover:bg-red-50 rounded-lg"><i class="fas fa-trash text-xs"></i></button>'
                        + '</div></div>';
                });
            }

            return '<div class="space-y-6 fade-in">'

                // KPI Cards
                + '<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">'
                + '<div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 card-hover">'
                + '<div class="flex items-center justify-between mb-3"><div class="p-2 bg-green-100 rounded-lg text-green-600"><i class="fas fa-arrow-up"></i></div><span class="text-xs text-gray-400">Este mes</span></div>'
                + '<p class="text-2xl font-bold text-gray-800">' + utils.formatCurrency(totalVentas) + '</p><p class="text-xs text-gray-500 mt-1">Ventas</p></div>'

                + '<div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 card-hover">'
                + '<div class="flex items-center justify-between mb-3"><div class="p-2 bg-purple-100 rounded-lg text-purple-600"><i class="fas fa-flask"></i></div><span class="text-xs text-gray-400">Este mes</span></div>'
                + '<p class="text-2xl font-bold text-gray-800">' + utils.formatCurrency(totalGastosInsumos) + '</p><p class="text-xs text-gray-500 mt-1">Gastos Insumos</p></div>'

                + '<div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 card-hover">'
                + '<div class="flex items-center justify-between mb-3"><div class="p-2 bg-orange-100 rounded-lg text-orange-600"><i class="fas fa-building"></i></div><span class="text-xs text-gray-400">Este mes</span></div>'
                + '<p class="text-2xl font-bold text-gray-800">' + utils.formatCurrency(totalGastosOp) + '</p><p class="text-xs text-gray-500 mt-1">Gastos Operativos</p></div>'

                + '<div class="bg-white p-5 rounded-2xl shadow-sm border card-hover ' + utilClase + '">'
                + '<div class="flex items-center justify-between mb-3"><div class="p-2 rounded-lg ' + utilIcono + '"><i class="fas fa-coins"></i></div><span class="text-xs text-gray-400">Este mes</span></div>'
                + '<p class="text-2xl font-bold ' + utilTexto + '">' + utils.formatCurrency(utilidad) + '</p><p class="text-xs text-gray-500 mt-1">Utilidad Neta</p></div>'
                + '</div>'

                // Toolbar
                + '<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">'
                + '<div class="flex flex-wrap gap-2 w-full sm:w-auto">'
                + '<select id="finTipoFiltro" onchange="finanzas.applyFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none">'
                + '<option value="">Todos los tipos</option>'
                + '<option value="venta"' + (tipoFiltro==='venta'?' selected':'') + '>Ventas</option>'
                + '<option value="gasto_insumo"' + (tipoFiltro==='gasto_insumo'?' selected':'') + '>Gastos Insumos</option>'
                + '<option value="gasto_operativo"' + (tipoFiltro==='gasto_operativo'?' selected':'') + '>Gastos Operativos</option>'
                + '</select>'
                + '<input type="month" id="finMesFiltro" value="' + mesFiltro + '" onchange="finanzas.applyFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none">'
                + '</div>'
                + '<div class="flex gap-2 w-full sm:w-auto">'
                + '<button onclick="finanzas.exportExcel()" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"><i class="fas fa-file-excel"></i> <span>Exportar Excel</span></button>'
                + '<button onclick="finanzas.showForm()" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"><i class="fas fa-plus"></i> <span>Registrar</span></button>'
                + '</div></div>'

                // Tabla / Cards
                + '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">'
                + '<div class="hidden md:block overflow-x-auto"><table class="w-full">'
                + '<thead class="bg-gray-50 border-b border-gray-200"><tr>'
                + '<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>'
                + '<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>'
                + '<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Concepto</th>'
                + '<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>'
                + '<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pedido</th>'
                + '<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Monto</th>'
                + '<th class="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>'
                + '</tr></thead>'
                + '<tbody class="divide-y divide-gray-100">' + rowsDesktop + '</tbody>'
                + '</table></div>'
                + '<div class="md:hidden divide-y divide-gray-100">' + cardsMobile + '</div>'
                + '</div>'
                + '</div>';
        }

        const finanzas = {
            applyFilter: () => {
                
                
                router.refresh();
            },

            deleteMovimiento: async (id) => {
                if (!confirm('¿Eliminar este movimiento?')) return;
                try {
                    await supabaseData.deleteFinance(id);
                    utils.notify('Movimiento eliminado', 'success');
                    await supabaseData.loadAll();
                    router.refresh();
                } catch (error) {
                    console.error(error);
                    utils.notify('No se pudo eliminar el movimiento: ' + (error.message || error), 'error');
                }
            },

            showForm: () => {
                const modal = document.getElementById('modal-content');
                const pedidosOptions = store.orders
                    .filter(o => o.status !== 'cancelado')
                    .map(o => `<option value="${o.id.substr(-6)}">#${o.id.substr(-6)} — ${o.clientName} (${utils.formatCurrency(o.total)})</option>`)
                    .join('');

                modal.innerHTML = `
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-bold text-gray-800">Registrar Movimiento</h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                        </div>
                        <form id="finanzasForm" onsubmit="finanzas.saveMovimiento(event)" class="space-y-4">

                            <!-- Tipo -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                                <div class="grid grid-cols-3 gap-2" id="tipoSelector">
                                    <button type="button" onclick="finanzas.selectTipo('venta')" id="btn_venta"
                                        class="tipo-btn py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center gap-1">
                                        <i class="fas fa-arrow-up text-green-500 text-lg"></i>Venta
                                    </button>
                                    <button type="button" onclick="finanzas.selectTipo('gasto_insumo')" id="btn_gasto_insumo"
                                        class="tipo-btn py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-400 hover:bg-purple-50 transition-all flex flex-col items-center gap-1">
                                        <i class="fas fa-flask text-purple-500 text-lg"></i>Insumo
                                    </button>
                                    <button type="button" onclick="finanzas.selectTipo('gasto_operativo')" id="btn_gasto_operativo"
                                        class="tipo-btn py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:border-orange-400 hover:bg-orange-50 transition-all flex flex-col items-center gap-1">
                                        <i class="fas fa-building text-orange-500 text-lg"></i>Operativo
                                    </button>
                                </div>
                                <input type="hidden" id="finTipo" required>
                            </div>

                            <!-- Concepto y Categoría -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Concepto *</label>
                                    <input type="text" id="finConcepto" required placeholder="Ej: Renta de local, Tinta DTF..."
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <input type="text" id="finCategoria" placeholder="Ej: Renta, Luz, Tintas..."
                                        list="categoriasSugeridas"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <datalist id="categoriasSugeridas">
                                        <option value="Renta">
                                        <option value="Luz">
                                        <option value="Agua">
                                        <option value="Internet">
                                        <option value="Salarios">
                                        <option value="Tintas DTF">
                                        <option value="Películas PET">
                                        <option value="Polvo Adhesivo">
                                        <option value="Mantenimiento">
                                        <option value="Transporte">
                                        <option value="Publicidad">
                                        <option value="Insumos Varios">
                                    </datalist>
                                </div>
                            </div>

                            <!-- Monto y Fecha -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Monto (MXN) *</label>
                                    <input type="number" id="finMonto" required min="0.01" step="0.01" placeholder="0.00"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                                    <input type="date" id="finFecha" required value="${new Date().toISOString().split('T')[0]}"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                </div>
                            </div>

                            <!-- Pedido relacionado (solo visible para ventas) -->
                            <div id="pedidoRefWrap">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Pedido relacionado</label>
                                <select id="finPedidoRef" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="">— Sin pedido vinculado —</option>
                                    ${pedidosOptions}
                                </select>
                            </div>

                            <!-- Notas -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                                <textarea id="finNotas" rows="2" placeholder="Observaciones adicionales..."
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>

                            <div class="flex gap-3 pt-2">
                                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                                <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                    <i class="fas fa-save mr-2"></i>Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                openModal();
                // ocultar pedido ref inicialmente
                document.getElementById('pedidoRefWrap').classList.add('hidden');
            },

            selectTipo: (tipo) => {
                document.getElementById('finTipo').value = tipo;
                const colors = { venta: 'border-green-500 bg-green-50', gasto_insumo: 'border-purple-500 bg-purple-50', gasto_operativo: 'border-orange-500 bg-orange-50' };
                document.querySelectorAll('.tipo-btn').forEach(btn => btn.classList.remove(...Object.values(colors).join(' ').split(' ')));
                document.getElementById(`btn_${tipo}`).classList.add(...colors[tipo].split(' '));
                // mostrar pedido ref solo en ventas
                const wrap = document.getElementById('pedidoRefWrap');
                if (tipo === 'venta') wrap.classList.remove('hidden');
                else wrap.classList.add('hidden');
            },

            saveMovimiento: async (e) => {
                e.preventDefault();
                const tipo = document.getElementById('finTipo').value;
                if (!tipo) { utils.notify('Selecciona un tipo', 'error'); return; }

                const mov = {
                    id: utils.generateId(),
                    tipo,
                    concepto: document.getElementById('finConcepto').value.trim(),
                    categoria: document.getElementById('finCategoria').value.trim(),
                    monto: parseFloat(document.getElementById('finMonto').value),
                    fecha: document.getElementById('finFecha').value,
                    pedidoRef: document.getElementById('finPedidoRef').value || null,
                    notas: document.getElementById('finNotas').value.trim(),
                    creadoEn: new Date().toISOString()
                };

                try {
                    await supabaseData.saveFinance(mov);
                    utils.notify('Movimiento registrado correctamente', 'success');
                    closeModal();
                    await supabaseData.loadAll();
                    router.refresh();
                } catch (error) {
                    console.error(error);
                    utils.notify('No se pudo registrar el movimiento: ' + (error.message || error), 'error');
                }
            },

            exportExcel: () => {
                // Construimos CSV como fallback universal sin dependencia externa
                const tipoLabel = { venta: 'Venta', gasto_insumo: 'Gasto Insumo', gasto_operativo: 'Gasto Operativo' };
                const rows = [['Fecha','Tipo','Concepto','Categoría','Pedido Ref','Monto (MXN)','Notas']];
                store.finanzas.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha)).forEach(m => {
                    rows.push([
                        m.fecha,
                        tipoLabel[m.tipo] || m.tipo,
                        m.concepto,
                        m.categoria || '',
                        m.pedidoRef ? '#' + m.pedidoRef : '',
                        (m.tipo === 'venta' ? 1 : -1) * m.monto,
                        m.notas || ''
                    ]);
                });
                // Totales al final
                const ventas = store.finanzas.filter(m=>m.tipo==='venta').reduce((a,m)=>a+m.monto,0);
                const gastosI = store.finanzas.filter(m=>m.tipo==='gasto_insumo').reduce((a,m)=>a+m.monto,0);
                const gastosO = store.finanzas.filter(m=>m.tipo==='gasto_operativo').reduce((a,m)=>a+m.monto,0);
                rows.push([]);
                rows.push(['RESUMEN','','','','','','']);
                rows.push(['Total Ventas','','','','', ventas,'']);
                rows.push(['Total Gastos Insumos','','','','', -gastosI,'']);
                rows.push(['Total Gastos Operativos','','','','', -gastosO,'']);
                rows.push(['UTILIDAD NETA','','','','', ventas-gastosI-gastosO,'']);

                const csv = rows.map(r => r.map(c => {
                    const s = String(c ?? '').replace(/"/g, '""');
                    return /[,"\n]/.test(s) ? `"${s}"` : s;
                }).join(',')).join('\r\n');

                const bom = '\uFEFF';
                const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `DTFPro_Finanzas_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                utils.notify('Archivo descargado. Ábrelo con Excel y guarda como .xlsx', 'success');
            }
        };

        // Kanban System
        const kanban = {
            drag: (ev, orderId) => {
                ev.dataTransfer.setData("orderId", orderId);
                ev.target.classList.add('dragging');
            },
            
            allowDrop: (ev) => {
                ev.preventDefault();
            },
            
            drop: async (ev, newStatus) => {
                ev.preventDefault();
                const orderId = ev.dataTransfer.getData("orderId");
                const order = store.orders.find(o => o.id === orderId);
                
                if (order && order.status !== newStatus) {
                    const previousStatus = order.status;
                    order.status = newStatus;
                    order.updatedAt = new Date().toISOString();
                    try {
                        await supabaseData.updateOrder(order, previousStatus);
                        utils.notify(`Pedido movido a: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
                        await supabaseData.loadAll();
                        router.refresh();
                    } catch (error) {
                        order.status = previousStatus;
                        utils.notify('No se pudo mover el pedido: ' + error.message, 'error');
                    }
                }
                
                document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
            }
        };

        // Router
        const router = {
            currentRoute: 'dashboard',
            
            navigate: (route) => {
                if (window.auth && !auth.canAccessRoute(route)) {
                    utils.notify('No tienes permiso para acceder a este módulo', 'error');
                    route = 'dashboard';
                }
                router.currentRoute = route;
                
                // Update sidebar active state
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    if (btn.dataset.route === route) {
                        btn.classList.add('bg-slate-800', 'text-white');
                        btn.classList.remove('hover:bg-slate-800');
                    } else {
                        btn.classList.remove('bg-slate-800', 'text-white');
                        btn.classList.add('hover:bg-slate-800');
                    }
                });

                // Update title
                const titles = {
                    dashboard: 'Dashboard',
                    orders: 'Pedidos',
                    quotes: 'Cotizaciones',
                    inventory: 'Inventario',
                    clients: 'Clientes',
                    finanzas: 'Finanzas',
                    users: 'Administración de usuarios',
                    designs: 'Biblioteca de Diseños'
                };
                document.getElementById('page-title').textContent = titles[route];

                // Render view
                const content = document.getElementById('content');
                let viewHtml = '';
                try {
                    if (route === 'users') {
                        // Render explícito para evitar que el módulo de usuarios se quede mostrando Dashboard.
                        viewHtml = renderUsersAdminView();
                    } else if (views[route]) {
                        viewHtml = views[route]();
                    } else {
                        viewHtml = views.dashboard();
                    }
                } catch (error) {
                    console.error('Error renderizando ruta:', route, error);
                    viewHtml = `
                        <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-6 text-red-700">
                            <h2 class="text-xl font-bold mb-2"><i class="fas fa-triangle-exclamation mr-2"></i>Error al cargar módulo</h2>
                            <p class="text-sm">No se pudo cargar el módulo <strong>${route}</strong>. Revisa la consola del navegador.</p>
                        </div>
                    `;
                }
                content.innerHTML = viewHtml;

                // Cargar datos del módulo Usuarios después de inyectar el HTML.
                if (route === 'users' && window.usersAdmin) {
                    setTimeout(() => window.usersAdmin.load(), 0);
                }
                
                // Restaurar tab de inventario si es necesario
                if (route === 'inventory') {
                    const savedTab = 'supplies';
                    switchInventoryTab(savedTab);
                }
                
                // Close mobile sidebar
                document.getElementById('sidebar').classList.remove('open');
            },
            
            refresh: () => {
                router.navigate(router.currentRoute);
            }
        };
        window.router = router;


        // Apertura robusta del módulo Usuarios.
        // Se usa desde el botón del sidebar para evitar problemas de caché/router en Vercel.
        window.openUsersAdminModule = function() {
            try {
                if (window.auth && auth.role !== 'administrador') {
                    utils.notify('No tienes permiso para acceder a este módulo', 'error');
                    return;
                }

                router.currentRoute = 'users';

                document.querySelectorAll('.nav-btn').forEach(btn => {
                    if (btn.dataset.route === 'users') {
                        btn.classList.add('bg-slate-800', 'text-white');
                        btn.classList.remove('hover:bg-slate-800');
                    } else {
                        btn.classList.remove('bg-slate-800', 'text-white');
                        btn.classList.add('hover:bg-slate-800');
                    }
                });

                const title = document.getElementById('page-title');
                if (title) title.textContent = 'Administración de usuarios';

                const content = document.getElementById('content');
                if (!content) return;

                content.innerHTML = renderUsersAdminView();
                setTimeout(() => {
                    if (window.usersAdmin) window.usersAdmin.load();
                }, 50);

                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.remove('open');
            } catch (error) {
                console.error('Error abriendo módulo Usuarios:', error);
                const content = document.getElementById('content');
                if (content) {
                    content.innerHTML = `
                        <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-6 text-red-700">
                            <h2 class="text-xl font-bold mb-2"><i class="fas fa-triangle-exclamation mr-2"></i>Error al cargar Usuarios</h2>
                            <p class="text-sm">${error.message || 'Error desconocido'}</p>
                        </div>
                    `;
                }
            }
        };

        // Alias estable: algunas versiones del index llamaban openUserAdminModule y otras openUsersAdminModule.
        // Dejamos ambos nombres para evitar errores por caché o por archivos mezclados en Vercel.
        window.openUserAdminModule = window.openUsersAdminModule;

        // Modal Functions
        function openModal() {
            document.getElementById('modal-overlay').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('modal-overlay').classList.add('hidden');
            document.body.style.overflow = '';
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        // Generar opciones de productos para el select
        function getProductOptions() {
            const prendas = store.products.filter(p => p.category === 'playeras' || p.category === 'sudaderas');
            const accesorios = store.products.filter(p => p.category === 'accesorios');
            const otros = store.products.filter(p => !['playeras','sudaderas','accesorios'].includes(p.category));
            
            let options = '<option value="">Seleccionar producto...</option>';
            options += '<optgroup label="Ropa">';
            prendas.forEach(p => {
                options += `<option value="${p.id}" data-price="${p.salePrice || p.cost * 2}" data-name="${p.name}" data-stock="${p.stock}" data-unit="${p.unit || 'pza'}">${p.name} (Stock: ${p.stock} ${p.unit || 'pza'})</option>`;
            });
            options += '</optgroup>';
            options += '<optgroup label="Accesorios">';
            accesorios.forEach(p => {
                options += `<option value="${p.id}" data-price="${p.salePrice || p.cost * 2}" data-name="${p.name}" data-stock="${p.stock}" data-unit="${p.unit || 'pza'}">${p.name} (Stock: ${p.stock} ${p.unit || 'pza'})</option>`;
            });
            options += '</optgroup>';
            if (otros.length > 0) {
                options += '<optgroup label="Otros">';
                otros.forEach(p => {
                    options += `<option value="${p.id}" data-price="${p.salePrice || p.cost * 2}" data-name="${p.name}" data-stock="${p.stock}" data-unit="${p.unit || 'pza'}">${p.name} (Stock: ${p.stock} ${p.unit || 'pza'})</option>`;
                });
                options += '</optgroup>';
            }
            options += '<option value="custom" data-price="0" data-name="Personalizado" data-unit="pza">Otro / Personalizado</option>';
            
            return options;
        }

        // Quick Actions
        async function showQuickOrder(preselectedDesign = null) {
            if (window.supabaseClient && supabaseData.enabled) {
                await supabaseData.migrateLocalClientsIfNeeded();
                await supabaseData.loadAll();
            }
            const modal = document.getElementById('modal-content');
            modal.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Nuevo Pedido</h2>
                        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <form id="orderForm" onsubmit="handleOrderSubmit(event)" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                                <select id="orderClient" name="orderClient" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required onchange="updateClientInfo()">
                                    <option value="">Seleccionar cliente...</option>
                                    ${store.clients.map(c => `<option value="${c.id}" data-type="${c.type}" data-discount="${c.discount}">${c.name} (${c.type})</option>`).join('')}
                                </select>
                                <div id="clientInfo" class="mt-2 text-sm text-gray-600 hidden">
                                    <p>Tipo: <span id="clientType" class="font-medium"></span></p>
                                    <p>Descuento: <span id="clientDiscount" class="font-medium text-green-600"></span>%</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Entrega</label>
                                <select id="deliveryType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onchange="toggleDeliveryAddress()">
                                    <option value="local">Entrega en local</option>
                                    <option value="pickup">Recoge cliente</option>
                                    <option value="shipping">Envío por paquetería</option>
                                </select>
                            </div>
                        </div>

                        <div id="deliveryAddressContainer" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Dirección de Entrega</label>
                            <textarea id="deliveryAddress" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Calle, número, colonia, CP..."></textarea>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="partialDelivery" class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                            <label for="partialDelivery" class="text-sm text-gray-700">Entrega parcial (especificar en notas)</label>
                        </div>

                        <div class="border-t pt-6">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold text-gray-800">Artículos</h3>
                                <button type="button" onclick="addOrderItem()" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                    <i class="fas fa-plus mr-1"></i>Agregar artículo
                                </button>
                            </div>
                            
                            <div id="orderItems" class="space-y-3">
                                ${renderOrderItem(preselectedDesign)}
                            </div>
                        </div>

                        <div class="border-t pt-4">
                            <div class="flex justify-between items-center text-lg font-bold text-gray-800">
                                <span>Total:</span>
                                <span id="orderTotal" class="text-indigo-600">$0.00</span>
                            </div>
                            <input type="hidden" id="orderTotalInput" value="0">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notas / Especificaciones del pedido</label>
                            <textarea id="orderNotes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Detalles generales del pedido, fechas de entrega parcial, etc...">${preselectedDesign ? `Diseño: ${preselectedDesign.name}` : ''}</textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                            <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Crear Pedido</button>
                        </div>
                    </form>
                </div>
            `;
            openModal();
            calculateOrderTotal();
        }

        function renderOrderItem(preselectedDesign = null) {
            return `
                <div class="order-item bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                        <div class="md:col-span-3">
                            <label class="block text-xs text-gray-600 mb-1">Producto *</label>
                            <select class="item-product w-full px-3 py-2 border border-gray-300 rounded text-sm" required onchange="onProductSelect(this)">
                                ${getProductOptions()}
                            </select>
                        </div>
                        <div class="md:col-span-4">
                            <label class="block text-xs text-gray-600 mb-1">Descripción / Notas del cliente</label>
                            <input type="text" class="item-desc w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Ej: Logo frontal, talla XL, color específico..." value="${preselectedDesign ? `Usar diseño: ${preselectedDesign.name}` : ''}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">Cantidad *</label>
                            <div class="flex items-center gap-1">
                                <input type="number" class="item-qty w-full px-3 py-2 border border-gray-300 rounded text-sm" value="1" min="0.01" step="0.01" required onchange="calculateOrderTotal()">
                                <span class="item-unit text-xs text-gray-500 whitespace-nowrap">pza</span>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">Precio Unit. *</label>
                            <input type="number" class="item-price w-full px-3 py-2 border border-gray-300 rounded text-sm" value="0" min="0" step="0.01" required onchange="calculateOrderTotal()">
                        </div>
                        <div class="md:col-span-1">
                            <button type="button" onclick="this.closest('.order-item').remove(); calculateOrderTotal()" class="text-red-500 hover:text-red-700 p-2 w-full">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500 item-stock-info hidden"></div>
                </div>
            `;
        }

        function addOrderItem() {
            const container = document.getElementById('orderItems');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = renderOrderItem();
            const newItem = tempDiv.firstElementChild;
            newItem.classList.add('fade-in');
            container.appendChild(newItem);
            calculateOrderTotal();
        }

        function onProductSelect(select) {
            const option = select.selectedOptions[0];
            const itemRow = select.closest('.order-item');
            const priceInput = itemRow.querySelector('.item-price');
            const stockInfo = itemRow.querySelector('.item-stock-info');
            const unitLabel = itemRow.querySelector('.item-unit');
            
            if (option && option.value) {
                const price = parseFloat(option.dataset.price) || 0;
                const stock = parseFloat(option.dataset.stock) || 0;
                const unit = option.dataset.unit || 'pza';
                const name = option.dataset.name || '';
                
                priceInput.value = price;
                if (unitLabel) unitLabel.textContent = unit;
                
                if (option.value !== 'custom') {
                    stockInfo.textContent = `Stock disponible: ${stock} ${unit} | ${name}. Captura decimales si aplica; ej. 25 cm = 0.25 m`;
                    stockInfo.classList.remove('hidden');
                    
                    const qtyInput = itemRow.querySelector('.item-qty');
                    qtyInput.max = stock;
                    qtyInput.onchange = function() {
                        if (parseFloat(this.value) > stock) {
                            utils.notify(`Stock insuficiente. Máximo disponible: ${stock} ${unit}`, 'warning');
                            this.value = stock;
                        }
                        calculateOrderTotal();
                    };
                } else {
                    stockInfo.textContent = 'Producto personalizado - sin control de inventario';
                    stockInfo.classList.remove('hidden');
                    if (unitLabel) unitLabel.textContent = 'pza';
                    priceInput.value = '';
                    priceInput.placeholder = 'Ingrese precio';
                    priceInput.focus();
                }
                
                calculateOrderTotal();
            }
        }

        function calculateOrderTotal() {
            let total = 0;
            document.querySelectorAll('.order-item').forEach(item => {
                const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
                const price = parseFloat(item.querySelector('.item-price').value) || 0;
                total += qty * price;
            });

            // Apply client discount if exists
            const clientSelect = document.getElementById('orderClient');
            if (clientSelect && clientSelect.selectedOptions[0] && clientSelect.selectedOptions[0].dataset.discount) {
                const discount = parseFloat(clientSelect.selectedOptions[0].dataset.discount) || 0;
                total = total * (1 - discount / 100);
            }

            document.getElementById('orderTotal').textContent = utils.formatCurrency(total);
            const totalInput = document.getElementById('orderTotalInput');
            if (totalInput) totalInput.value = total;
        }

        function updateClientInfo() {
            const select = document.getElementById('orderClient');
            if (!select) return;
            
            const option = select.selectedOptions[0];
            if (option && option.value) {
                document.getElementById('clientInfo').classList.remove('hidden');
                document.getElementById('clientType').textContent = option.dataset.type || 'menudeo';
                document.getElementById('clientDiscount').textContent = option.dataset.discount || '0';
            } else {
                document.getElementById('clientInfo').classList.add('hidden');
            }
            calculateOrderTotal();
        }

        function toggleDeliveryAddress() {
            const type = document.getElementById('deliveryType').value;
            const container = document.getElementById('deliveryAddressContainer');
            if (type === 'shipping') {
                container.classList.remove('hidden');
            } else {
                container.classList.add('hidden');
            }
        }

        async function handleOrderSubmit(e) {
            e.preventDefault();
            
            const clientSelect = document.getElementById('orderClient');
            const clientId = clientSelect.value;
            
            if (!clientId) {
                utils.notify('Por favor selecciona un cliente', 'error');
                return;
            }
            
            const client = store.clients.find(c => c.id === clientId);
            
            if (!client) {
                utils.notify('Cliente no encontrado en la base de datos', 'error');
                return;
            }
            
            const items = [];
            const stockUpdates = [];
            
            document.querySelectorAll('.order-item').forEach(item => {
                const productSelect = item.querySelector('.item-product');
                const productId = productSelect.value;
                const option = productSelect.selectedOptions[0];
                const desc = item.querySelector('.item-desc').value.trim();
                const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
                const price = parseFloat(item.querySelector('.item-price').value) || 0;
                
                if (!productId) {
                    utils.notify('Selecciona un producto para cada artículo', 'error');
                    throw new Error('Producto no seleccionado');
                }
                
                if (qty <= 0) {
                    utils.notify('La cantidad debe ser mayor a 0', 'error');
                    throw new Error('Cantidad inválida');
                }
                
                if (productId !== 'custom') {
                    const product = store.products.find(p => p.id === productId);
                    if (product) {
                        if (product.stock < qty) {
                            utils.notify(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`, 'error');
                            throw new Error('Stock insuficiente');
                        }
                        
                        stockUpdates.push({
                            product: product,
                            qty: qty
                        });
                        
                        items.push({
                            productId: productId,
                            productName: product.name,
                            description: desc,
                            quantity: qty,
                            price: price
                        });
                    }
                } else {
                    items.push({
                        productId: 'custom',
                        productName: 'Personalizado',
                        description: desc || 'Producto personalizado',
                        quantity: qty,
                        price: price
                    });
                }
            });

            if (items.length === 0) {
                utils.notify('Agrega al menos un artículo al pedido', 'error');
                return;
            }

            const totalValue = parseFloat(document.getElementById('orderTotalInput').value) || items.reduce((a, b) => a + (b.quantity * b.price), 0);

            const order = {
                id: utils.generateId(),
                clientId: clientId,
                clientName: client.name,
                clientPhone: client.phone || '',
                clientEmail: client.email || '',
                items: items,
                total: totalValue,
                status: 'recibido',
                deliveryType: document.getElementById('deliveryType').value || 'local',
                deliveryAddress: document.getElementById('deliveryAddress').value || '',
                partialDelivery: document.getElementById('partialDelivery').checked,
                description: document.getElementById('orderNotes').value || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            try {
                await supabaseData.saveOrder(order);
                utils.notify('Pedido creado exitosamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                utils.notify('No se pudo guardar el pedido: ' + (error.message || error.details || error.hint || JSON.stringify(error)), 'error');
            }
        }

        function showQuickQuote() {
            const modal = document.getElementById('modal-content');
            modal.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Nueva Cotización</h2>
                        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <form id="quoteForm" onsubmit="handleQuoteSubmit(event)" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                                <select id="quoteClient" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required>
                                    <option value="">Seleccionar cliente...</option>
                                    ${store.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Producto *</label>
                                <select id="quoteProduct" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required onchange="updateQuoteProductInfo()">
                                    ${getProductOptions()}
                                </select>
                            </div>
                        </div>

                        <div id="quoteProductInfo" class="hidden bg-blue-50 p-3 rounded-lg text-sm text-blue-800"></div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad de Piezas *</label>
                                <input type="number" id="quoteQty" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value="10" min="1" required onchange="calculateQuote()">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tamaño del Diseño</label>
                                <select id="quoteSize" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onchange="calculateQuote()">
                                    <option value="small">Pequeño (10x10cm)</option>
                                    <option value="medium" selected>Mediano (20x20cm)</option>
                                    <option value="large">Grande (30x30cm)</option>
                                    <option value="xlarge">Extra Grande (40x40cm)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Colores del Diseño</label>
                            <div class="flex gap-4">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="colors" value="1" checked onchange="calculateQuote()" class="text-indigo-600">
                                    <span class="text-sm">1 color</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="colors" value="2-4" onchange="calculateQuote()" class="text-indigo-600">
                                    <span class="text-sm">2-4 colores</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="colors" value="full" onchange="calculateQuote()" class="text-indigo-600">
                                    <span class="text-sm">Full color (CMYK)</span>
                                </label>
                            </div>
                        </div>

                        <div class="bg-indigo-50 p-4 rounded-xl">
                            <h3 class="font-semibold text-indigo-900 mb-3">Desglose de Precios</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-indigo-700">Producto base:</span>
                                    <span id="quoteProductDisplay" class="font-medium">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-indigo-700">Precio base por pieza:</span>
                                    <span id="basePrice" class="font-medium">${utils.formatCurrency(80)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-indigo-700">Factor tamaño:</span>
                                    <span id="sizeFactor" class="font-medium">x1.0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-indigo-700">Factor colores:</span>
                                    <span id="colorFactor" class="font-medium">x1.0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-indigo-700">Descuento volumen:</span>
                                    <span id="volumeDiscount" class="font-medium text-green-600">-0%</span>
                                </div>
                                <div class="border-t border-indigo-200 pt-2 flex justify-between text-lg font-bold">
                                    <span class="text-indigo-900">Total estimado:</span>
                                    <span id="quoteTotal" class="text-indigo-600">${utils.formatCurrency(800)}</span>
                                </div>
                                <p class="text-xs text-indigo-600 mt-2">* Precio estimado. Válido por 1 año.</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notas adicionales</label>
                            <textarea id="quoteNotes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Especificaciones especiales..."></textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancelar</button>
                            <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Guardar Cotización</button>
                        </div>
                    </form>
                </div>
            `;
            openModal();
            updateQuoteProductInfo();
            calculateQuote();
        }

        function updateQuoteProductInfo() {
            const select = document.getElementById('quoteProduct');
            const option = select.selectedOptions[0];
            const infoDiv = document.getElementById('quoteProductInfo');
            
            if (option && option.value && option.value !== 'custom') {
                const name = option.dataset.name;
                const stock = option.dataset.stock;
                const price = option.dataset.price;
                
                infoDiv.innerHTML = `
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>${name}</strong> - Stock: ${stock} unidades - Precio sugerido: ${utils.formatCurrency(price)}
                `;
                infoDiv.classList.remove('hidden');
            } else if (option && option.value === 'custom') {
                infoDiv.innerHTML = `<i class="fas fa-info-circle mr-2"></i>Producto personalizado - sin control de inventario`;
                infoDiv.classList.remove('hidden');
            } else {
                infoDiv.classList.add('hidden');
            }
        }

        function calculateQuote() {
            const qty = parseInt(document.getElementById('quoteQty').value) || 1;
            const size = document.getElementById('quoteSize').value;
            const colors = document.querySelector('input[name="colors"]:checked').value;
            const productSelect = document.getElementById('quoteProduct');
            const productOption = productSelect ? productSelect.selectedOptions[0] : null;
            
            // Obtener precio base del producto seleccionado o usar default
            let basePrice = store.config.prices.basePrice;
            if (productOption && productOption.dataset.price) {
                basePrice = parseFloat(productOption.dataset.price);
            }
            
            const config = store.config.prices;
            
            // Size multiplier
            const sizeMult = config.sizeMultiplier[size];
            basePrice *= sizeMult;
            
            // Color multiplier
            let colorMult = 1;
            if (colors === '2-4') colorMult = config.colorMultiplier;
            if (colors === 'full') colorMult = config.colorMultiplier * 1.3;
            basePrice *= colorMult;
            
            // Volume discount
            let discount = 0;
            for (let [threshold, disc] of Object.entries(config.volumeDiscount).sort((a,b) => b[0]-a[0])) {
                if (qty >= parseInt(threshold)) {
                    discount = disc;
                    break;
                }
            }
            
            const subtotal = basePrice * qty;
            const total = subtotal * (1 - discount / 100);
            
            // Actualizar display del producto
            const productDisplay = document.getElementById('quoteProductDisplay');
            if (productDisplay && productOption) {
                productDisplay.textContent = productOption.dataset.name || 'Personalizado';
            }
            
            document.getElementById('basePrice').textContent = utils.formatCurrency(basePrice);
            document.getElementById('sizeFactor').textContent = 'x' + sizeMult;
            document.getElementById('colorFactor').textContent = 'x' + colorMult.toFixed(1);
            document.getElementById('volumeDiscount').textContent = `-${discount}%`;
            document.getElementById('quoteTotal').textContent = utils.formatCurrency(total);
            
            return total;
        }

        async function handleQuoteSubmit(e) {
            e.preventDefault();

            const clientId = document.getElementById('quoteClient').value;
            const client = store.clients.find(c => c.id === clientId);
            if (!client) { utils.notify('Cliente no encontrado', 'error'); return; }

            const productSelect = document.getElementById('quoteProduct');
            const productOption = productSelect.selectedOptions[0];
            const productId = productSelect.value;
            const productName = productOption ? (productOption.dataset.name || 'Personalizado') : 'Personalizado';
            if (!productId) { utils.notify('Selecciona un producto', 'error'); return; }

            const qty = parseFloat(document.getElementById('quoteQty').value) || 0;
            const total = calculateQuote();
            const quote = {
                id: utils.generateId(),
                clientId,
                clientName: client.name,
                clientPhone: client.phone || '',
                productId,
                productName,
                qty,
                size: document.getElementById('quoteSize').value,
                colors: document.querySelector('input[name=\"colors\"]:checked').value,
                total,
                subtotal: total,
                discount: Number(client.discount || 0),
                notes: document.getElementById('quoteNotes').value,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0,10),
                convertedToOrder: false,
                items: [{ productId, productName, quantity: qty, price: qty ? total / qty : total, size: document.getElementById('quoteSize').value, colors: document.querySelector('input[name=\"colors\"]:checked').value, description: document.getElementById('quoteNotes').value }]
            };

            try {
                await supabaseData.saveQuote(quote);
                utils.notify('Cotización guardada exitosamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error('Error guardando cotización:', error);
                utils.notify('No se pudo guardar la cotización: ' + (error.message || error.details || error.hint || JSON.stringify(error)), 'error');
            }
        }

        async function quoteToOrder(quoteId) {
            const quote = store.quotes.find(q => q.id === quoteId);
            if (!quote) return;

            if (confirm('¿Convertir esta cotización en pedido?')) {
                const qty = Number(quote.qty || (quote.items && quote.items[0] && quote.items[0].quantity) || 1);
                const order = {
                    id: utils.generateId(),
                    clientId: quote.clientId,
                    clientName: quote.clientName,
                    clientPhone: quote.clientPhone || '',
                    items: [{
                        productId: quote.productId || (quote.items && quote.items[0] && quote.items[0].productId) || 'custom',
                        productName: quote.productName || (quote.items && quote.items[0] && quote.items[0].productName) || `Cotización #${quote.id.substr(-4)}`,
                        description: quote.notes || `Impresión DTF - ${qty} piezas tamaño ${quote.size || ''}`,
                        quantity: qty,
                        price: qty ? Number(quote.total || 0) / qty : Number(quote.total || 0)
                    }],
                    total: Number(quote.total || 0),
                    status: 'recibido',
                    deliveryType: 'local',
                    description: quote.notes || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                try {
                    await supabaseData.saveOrder(order);
                    quote.convertedToOrder = true;
                    quote.orderId = order.id;
                    quote.convertedOrderId = order.id;
                    quote.status = 'convertida';
                    await supabaseData.saveQuote(quote);
                    utils.notify('Cotización convertida a pedido exitosamente', 'success');
                    await supabaseData.loadAll();
                    router.navigate('orders');
                } catch (error) {
                    console.error('Error convirtiendo cotización:', error);
                    utils.notify('No se pudo convertir la cotización: ' + (error.message || error.details || error.hint || JSON.stringify(error)), 'error');
                }
            }
        }

        // NUEVAS FUNCIONES PARA CLIENTES PROFESIONALES

        function toggleEditDeliveryAddress() {
            const type = document.getElementById('editDeliveryType').value;
            const wrap = document.getElementById('editDeliveryAddressWrap');
            wrap.classList.toggle('hidden', type !== 'shipping');
        }

        function addEditOrderItem() {
            const container = document.getElementById('editOrderItems');
            const div = document.createElement('div');
            div.className = 'edit-order-item bg-gray-50 p-3 rounded-lg border border-gray-200 fade-in';
            div.innerHTML = `
                <div class="grid grid-cols-12 gap-2 items-end">
                    <div class="col-span-4">
                        <label class="block text-xs text-gray-600 mb-1">Producto</label>
                        <select class="edit-item-product w-full px-2 py-2 border border-gray-300 rounded text-sm" onchange="onEditProductSelect(this)">
                            ${getProductOptions()}
                        </select>
                    </div>
                    <div class="col-span-3">
                        <label class="block text-xs text-gray-600 mb-1">Descripción</label>
                        <input type="text" class="edit-item-desc w-full px-2 py-2 border border-gray-300 rounded text-sm" placeholder="Notas...">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs text-gray-600 mb-1">Cantidad</label>
                        <input type="number" class="edit-item-qty w-full px-2 py-2 border border-gray-300 rounded text-sm" value="1" min="0.01" step="0.01" onchange="calculateEditOrderTotal()">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs text-gray-600 mb-1">Precio unit.</label>
                        <input type="number" class="edit-item-price w-full px-2 py-2 border border-gray-300 rounded text-sm" value="0" min="0" step="0.01" onchange="calculateEditOrderTotal()">
                    </div>
                    <div class="col-span-1">
                        <button type="button" onclick="this.closest('.edit-order-item').remove(); calculateEditOrderTotal()" class="text-red-500 hover:text-red-700 p-2 w-full"><i class="fas fa-trash text-xs"></i></button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        }

        function onEditProductSelect(select) {
            const option = select.selectedOptions[0];
            const row = select.closest('.edit-order-item');
            const priceInput = row.querySelector('.edit-item-price');
            if (option && option.value && option.value !== 'custom') {
                priceInput.value = parseFloat(option.dataset.price) || 0;
            }
            calculateEditOrderTotal();
        }

        function calculateEditOrderTotal() {
            let total = 0;
            document.querySelectorAll('.edit-order-item').forEach(item => {
                const qty = parseFloat(item.querySelector('.edit-item-qty').value) || 0;
                const price = parseFloat(item.querySelector('.edit-item-price').value) || 0;
                total += qty * price;
            });
            const el = document.getElementById('editOrderTotal');
            const inp = document.getElementById('editOrderTotalInput');
            if (el) el.textContent = utils.formatCurrency(total);
            if (inp) inp.value = total;
        }

        async function handleOrderUpdate(e, orderId) {
            e.preventDefault();
            const order = store.orders.find(o => o.id === orderId);
            if (!order) return;
            const previousStatus = order.status;

            const items = [];
            document.querySelectorAll('.edit-order-item').forEach(item => {
                const productSelect = item.querySelector('.edit-item-product');
                const productId = productSelect.value;
                const option = productSelect.selectedOptions[0];
                const qty = parseFloat(item.querySelector('.edit-item-qty').value) || 0;
                const price = parseFloat(item.querySelector('.edit-item-price').value) || 0;
                const desc = item.querySelector('.edit-item-desc').value.trim();
                if (!productId || qty <= 0) return;
                const product = store.products.find(p => p.id === productId);
                items.push({
                    productId,
                    productName: product ? product.name : (option?.dataset?.name || 'Personalizado'),
                    description: desc,
                    quantity: qty,
                    price
                });
            });

            if (items.length === 0) {
                utils.notify('Agrega al menos un artículo', 'error');
                return;
            }

            const clientId = document.getElementById('editOrderClient').value;
            const client = store.clients.find(c => c.id === clientId);

            order.clientId = clientId;
            order.clientName = client ? client.name : order.clientName;
            order.clientPhone = client ? client.phone : order.clientPhone;
            order.status = document.getElementById('editOrderStatus').value;
            order.deliveryType = document.getElementById('editDeliveryType').value;
            order.deliveryAddress = document.getElementById('editDeliveryAddress')?.value || '';
            order.partialDelivery = document.getElementById('editPartialDelivery').checked;
            order.description = document.getElementById('editOrderNotes').value;
            order.items = items;
            order.total = parseFloat(document.getElementById('editOrderTotalInput').value) || 0;
            order.updatedAt = new Date().toISOString();

            try {
                await supabaseData.updateOrder(order, previousStatus);
                utils.notify('Pedido actualizado correctamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                utils.notify('No se pudo actualizar el pedido: ' + error.message, 'error');
            }
        }

        async function handleClientUpdate(e, clientId) {
            e.preventDefault();
            const client = store.clients.find(c => c.id === clientId);
            if (!client) return;

            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            if (!name || !phone || !email) {
                utils.notify('Completa los campos obligatorios', 'error');
                return;
            }
            const rfc = document.getElementById('clientRFC').value.trim().toUpperCase();
            if (rfc && rfc.length !== 12 && rfc.length !== 13) {
                utils.notify('El RFC debe tener 12 o 13 caracteres', 'warning');
                return;
            }

            client.name = name;
            client.phone = phone;
            client.phone2 = document.getElementById('clientPhone2').value.trim();
            client.email = email;
            client.type = document.querySelector('input[name="clientType"]:checked').value;
            client.discount = parseFloat(document.getElementById('clientDiscount').value) || 0;
            client.rfc = rfc;
            client.regimenFiscal = document.getElementById('clientRegimen').value;
            client.usoCFDI = document.getElementById('clientUsoCFDI').value;
            client.notes = document.getElementById('clientNotes').value.trim();
            client.address = {
                street: document.getElementById('clientStreet').value.trim(),
                colonia: document.getElementById('clientColonia').value.trim(),
                cp: document.getElementById('clientCP').value.trim(),
                city: document.getElementById('clientCity').value.trim(),
                state: document.getElementById('clientState').value,
                referencias: ''
            };
            client.updatedAt = new Date().toISOString();

            try {
                await supabaseData.saveClient(client);
                utils.notify(`Cliente "${client.name}" actualizado correctamente`, 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo actualizar el cliente: ' + (error.message || error), 'error');
            }
        }

        async function confirmDeleteOrder(orderId) {
            if (!confirm('¿Eliminar este pedido permanentemente? Esta acción no se puede deshacer.')) return;
            try {
                await supabaseData.deleteOrder(orderId);
                utils.notify('Pedido eliminado', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo eliminar el pedido: ' + (error.message || error), 'error');
            }
        }

        async function confirmDeleteClient(clientId) {
            const client = store.clients.find(c => c.id === clientId);
            const hasOrders = store.orders.some(o => o.clientId === clientId);
            if (hasOrders) {
                utils.notify('No se puede eliminar: el cliente tiene pedidos asociados', 'error');
                return;
            }
            if (!confirm(`¿Eliminar al cliente "${client?.name}"? Esta acción no se puede deshacer.`)) return;
            try {
                await supabaseData.deleteClient(clientId);
                utils.notify('Cliente eliminado', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo eliminar el cliente: ' + (error.message || error), 'error');
            }
        }

        async function handleUpdateItem(e, itemId, type) {
            e.preventDefault();
            const storeKey = type === 'supply' ? 'supplies' : 'products';
            const item = store[storeKey].find(i => i.id === itemId);
            if (!item) return;

            item.name = document.getElementById('editItemName').value.trim();
            item.category = document.getElementById('editItemCategory').value;
            item.subcategory = document.getElementById('editItemSubcategory').value;
            item.stock = parseFloat(document.getElementById('editItemStock').value) || 0;
            item.minStock = parseFloat(document.getElementById('editItemMinStock').value) || 0;
            item.unit = document.getElementById('editItemUnit').value;
            item.cost = parseFloat(document.getElementById('editItemCost').value) || 0;
            item.description = document.getElementById('editItemDescription').value.trim();
            item.updatedAt = new Date().toISOString();

            if (type === 'product') {
                const sp = document.getElementById('editItemSalePrice');
                if (sp) item.salePrice = parseFloat(sp.value) || 0;
            } else {
                const loc = document.getElementById('editItemLocation');
                if (loc) item.location = loc.value.trim();
            }

            try {
                if (type === 'supply') await supabaseData.saveSupply(item);
                else await supabaseData.saveProduct(item);
                utils.notify(`${type === 'supply' ? 'Insumo' : 'Producto'} actualizado correctamente`, 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo actualizar: ' + (error.message || error), 'error');
            }
        }

        async function confirmDeleteItem(itemId, type) {
            const storeKey = type === 'supply' ? 'supplies' : 'products';
            const item = store[storeKey].find(i => i.id === itemId);
            if (!confirm(`¿Eliminar "${item?.name}"? Esta acción no se puede deshacer.`)) return;
            try {
                await supabaseData.deleteItem(itemId, type);
                utils.notify(`${type === 'supply' ? 'Insumo' : 'Producto'} eliminado`, 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo eliminar: ' + (error.message || error), 'error');
            }
        }

        function toggleFiscalFields() {
            const tipo = document.querySelector('input[name="clientType"]:checked').value;
            const fiscalSection = document.getElementById('fiscalSection');
            
            // Para mayoreo, sugerir llenar datos fiscales
            if (tipo === 'mayoreo') {
                fiscalSection.classList.add('border-2', 'border-indigo-200', 'rounded-lg', 'p-4');
                fiscalSection.style.backgroundColor = '#fafafa';
            } else {
                fiscalSection.classList.remove('border-2', 'border-indigo-200', 'rounded-lg', 'p-4');
                fiscalSection.style.backgroundColor = '';
            }
        }

        async function handleClientSubmit(e) {
            e.preventDefault();
            
            // Recopilar datos del formulario
            const clientData = {
                id: utils.generateId(),
                name: document.getElementById('clientName').value.trim(),
                phone: document.getElementById('clientPhone').value.trim(),
                phone2: document.getElementById('clientPhone2').value.trim(),
                email: document.getElementById('clientEmail').value.trim(),
                type: document.querySelector('input[name="clientType"]:checked').value,
                discount: parseFloat(document.getElementById('clientDiscount').value) || 0,
                
                // Datos fiscales
                rfc: document.getElementById('clientRFC').value.trim().toUpperCase(),
                regimenFiscal: document.getElementById('clientRegimen').value,
                usoCFDI: document.getElementById('clientUsoCFDI').value,
                
                // Dirección completa
                address: {
                    street: document.getElementById('clientStreet').value.trim(),
                    colonia: document.getElementById('clientColonia').value.trim(),
                    cp: document.getElementById('clientCP').value.trim(),
                    city: document.getElementById('clientCity').value.trim(),
                    state: document.getElementById('clientState').value,
                    referencias: document.getElementById('clientReferencias').value.trim()
                },
                
                // Notas
                notes: document.getElementById('clientNotes').value.trim(),
                
                // Metadatos
                designs: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Validaciones básicas
            if (!clientData.name || !clientData.phone || !clientData.email) {
                utils.notify('Por favor complete los campos obligatorios', 'error');
                return;
            }

            // Validar RFC si se proporcionó (formato básico)
            if (clientData.rfc && clientData.rfc.length !== 12 && clientData.rfc.length !== 13) {
                utils.notify('El RFC debe tener 12 o 13 caracteres', 'warning');
                document.getElementById('clientRFC').focus();
                return;
            }

            // Guardar cliente en Supabase y refrescar catálogo antes de crear pedidos
            try {
                await supabaseData.saveClient(clientData);
                utils.notify(`Cliente "${clientData.name}" registrado exitosamente`, 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                utils.notify('No se pudo guardar el cliente: ' + error.message, 'error');
            }
        }

        function formatAddress(client) {
            if (!client.address) return 'Sin dirección registrada';
            
            const addr = client.address;
            const parts = [
                addr.street,
                addr.colonia,
                addr.cp ? `CP ${addr.cp}` : '',
                addr.city,
                addr.state
            ].filter(Boolean);
            
            return parts.join(', ');
        }

        function previewDesignFile(input) {
            const file = input.files[0];
            if (!file) return;

            const previewArea = document.getElementById('filePreviewArea');
            const imagePreview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            const fileName = document.getElementById('fileName');
            const fileSize = document.getElementById('fileSize');

            // Mostrar nombre y tamaño
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);

            // Si es imagen, mostrar preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewArea.classList.add('hidden');
                    imagePreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                // Para otros archivos, mostrar icono según tipo
                previewArea.classList.add('hidden');
                imagePreview.classList.remove('hidden');
                previewImg.src = getFileIcon(file.name);
            }
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function getFileIcon(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            const icons = {
                pdf: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
                ai: 'https://cdn-icons-png.flaticon.com/512/5611/5611129.png',
                psd: 'https://cdn-icons-png.flaticon.com/512/5611/5611036.png',
                eps: 'https://cdn-icons-png.flaticon.com/512/5611/5611015.png'
            };
            return icons[ext] || 'https://cdn-icons-png.flaticon.com/512/2965/2965306.png';
        }

        function handleDesignUpload(e) {
            e.preventDefault();
            
            const name = document.getElementById('designName').value.trim();
            const clientId = document.getElementById('designClient').value;
            const fileInput = document.getElementById('designFile');
            const notes = document.getElementById('designNotes').value.trim();
            
            if (!name || !fileInput.files[0]) {
                utils.notify('Completa todos los campos obligatorios', 'error');
                return;
            }

            const file = fileInput.files[0];
            const client = clientId ? store.clients.find(c => c.id === clientId) : null;

            // Crear objeto diseño
            const design = {
                id: utils.generateId(),
                name: name,
                clientId: clientId || null,
                clientName: client ? client.name : 'Sin cliente',
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                fileType: file.type,
                notes: notes,
                createdAt: new Date().toISOString()
            };

            // Si es imagen, guardar como base64 para preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    design.imageData = e.target.result;
                    finishDesignUpload(design);
                };
                reader.readAsDataURL(file);
            } else {
                // Para otros archivos, usar icono genérico
                design.imageData = null;
                design.iconUrl = getFileIcon(file.name);
                finishDesignUpload(design);
            }
        }

        async function finishDesignUpload(design) {
            try {
                await supabaseData.saveDesign(design);
                utils.notify('Diseño subido exitosamente', 'success');
                closeModal();
                await supabaseData.loadAll();
                router.refresh();
            } catch (error) {
                console.error(error);
                utils.notify('No se pudo subir el diseño: ' + (error.message || error), 'error');
            }
        }



        // Seguridad básica de front-end: sanitización de textos y datos locales.
        const security = {
            cleanText(value) {
                if (value === null || value === undefined) return '';
                const raw = String(value);
                if (window.DOMPurify) return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
                return raw.replace(/[<>&"']/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[ch])).trim();
            },
            sanitizeObject(obj) {
                if (!obj || typeof obj !== 'object') return obj;
                Object.keys(obj).forEach(key => {
                    const val = obj[key];
                    if (typeof val === 'string') obj[key] = security.cleanText(val);
                    else if (Array.isArray(val)) val.forEach(item => security.sanitizeObject(item));
                    else if (val && typeof val === 'object') security.sanitizeObject(val);
                });
                return obj;
            },
            sanitizeStore(storeRef) {
                ['orders','quotes','supplies','products','clients','invoices','finanzas','designs'].forEach(k => {
                    if (Array.isArray(storeRef[k])) storeRef[k].forEach(item => security.sanitizeObject(item));
                });
            },
            bindSanitizedInputs() {
                document.addEventListener('change', (event) => {
                    const el = event.target;
                    if (el && ['INPUT','TEXTAREA'].includes(el.tagName) && el.type !== 'password' && el.type !== 'file') {
                        el.value = security.cleanText(el.value);
                    }
                }, true);
            }
        };
        security.bindSanitizedInputs();



        // Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            await auth.init();
            security.sanitizeStore(store);
            await supabaseData.loadAll();
            auth.applyRoleUI();
            router.navigate('dashboard');
            
            // Close modal on overlay click
            document.getElementById('modal-overlay').addEventListener('click', (e) => {
                if (e.target.id === 'modal-overlay') closeModal();
            });
        });
    