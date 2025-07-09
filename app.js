class CoralTrack {
    constructor() {
        this.parametros = JSON.parse(localStorage.getItem('parametros')) || [];
        this.fotos = JSON.parse(localStorage.getItem('fotos')) || { pachyclavularia: [], palythoa: [] };
        this.charts = {};
        
        // No cargar datos automáticamente
        
        this.init();
    }
    
    cargarDatosEjemplo() {
        const fechas = [];
        for (let i = 30; i >= 0; i -= 3) {
            fechas.push(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        }
        
        const datosEjemplo = [
            { fecha: fechas[0], densidad: 1.023, kh: 7.8, calcio: 400, magnesio: 1300, nitratos: 12, fosfatos: 0.08, temperatura: 24.8, notas: "Inicio del mes" },
            { fecha: fechas[1], densidad: 1.024, kh: 8.0, calcio: 405, magnesio: 1310, nitratos: 10, fosfatos: 0.06, temperatura: 25.0, notas: "Cambio de agua 20%" },
            { fecha: fechas[2], densidad: 1.024, kh: 8.2, calcio: 410, magnesio: 1320, nitratos: 8, fosfatos: 0.05, temperatura: 25.2, notas: "Corales con buena coloración" },
            { fecha: fechas[3], densidad: 1.025, kh: 8.3, calcio: 415, magnesio: 1330, nitratos: 7, fosfatos: 0.04, temperatura: 25.3, notas: "Dosificación de calcio" },
            { fecha: fechas[4], densidad: 1.025, kh: 8.5, calcio: 420, magnesio: 1340, nitratos: 6, fosfatos: 0.03, temperatura: 25.5, notas: "Parámetros estables" },
            { fecha: fechas[5], densidad: 1.025, kh: 8.4, calcio: 418, magnesio: 1335, nitratos: 5, fosfatos: 0.03, temperatura: 25.4, notas: "Crecimiento visible en SPS" },
            { fecha: fechas[6], densidad: 1.026, kh: 8.6, calcio: 425, magnesio: 1350, nitratos: 4, fosfatos: 0.02, temperatura: 25.6, notas: "Excelente estabilidad" },
            { fecha: fechas[7], densidad: 1.026, kh: 8.7, calcio: 430, magnesio: 1360, nitratos: 3, fosfatos: 0.02, temperatura: 25.7, notas: "Corales con extensión máxima" },
            { fecha: fechas[8], densidad: 1.025, kh: 8.5, calcio: 425, magnesio: 1345, nitratos: 4, fosfatos: 0.025, temperatura: 25.5, notas: "Mantenimiento de equipos" },
            { fecha: fechas[9], densidad: 1.025, kh: 8.8, calcio: 435, magnesio: 1365, nitratos: 2, fosfatos: 0.015, temperatura: 25.8, notas: "Parámetros óptimos" },
            { fecha: fechas[10], densidad: 1.026, kh: 8.9, calcio: 440, magnesio: 1370, nitratos: 2, fosfatos: 0.01, temperatura: 25.9, notas: "Mejor mes del año" }
        ];
        
        this.parametros = datosEjemplo;
        localStorage.setItem('parametros', JSON.stringify(this.parametros));
    }

    init() {
        this.setupTabs();
        this.setupForm();
        this.setupCoralTabs();
        this.setupModal();
        this.setFechaActual();
        this.renderCharts();
        this.renderHistorial();
        this.renderFotos();
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
            });
        });
    }

    setupForm() {
        document.getElementById('parametros-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarParametros();
        });
        
        document.getElementById('limpiar-datos').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
                this.parametros = [];
                localStorage.removeItem('parametros');
                this.renderCharts();
                this.renderHistorial();
                this.mostrarConfirmacion('Datos limpiados exitosamente');
            }
        });
        
        document.getElementById('datos-ejemplo').addEventListener('click', () => {
            this.cargarDatosEjemplo();
            this.renderCharts();
            this.renderHistorial();
            this.mostrarConfirmacion('Datos de ejemplo cargados');
        });
    }

    setupCoralTabs() {
        document.querySelectorAll('.coral-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.coral-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.coral-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.coral).classList.add('active');
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('modal');
        const close = document.querySelector('.close');
        
        close.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Soporte táctil mejorado
        close.addEventListener('touchend', (e) => {
            e.preventDefault();
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Cerrar con swipe down en móvil
        let startY = 0;
        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        modal.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            if (endY - startY > 100) {
                modal.style.display = 'none';
            }
        });
    }

    setFechaActual() {
        document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    }

    guardarParametros() {
        const formData = new FormData(document.getElementById('parametros-form'));
        const parametro = {};
        
        for (let [key, value] of formData.entries()) {
            parametro[key] = key === 'fecha' || key === 'notas' ? value : parseFloat(value) || null;
        }
        
        this.parametros.push(parametro);
        localStorage.setItem('parametros', JSON.stringify(this.parametros));
        
        // Feedback táctil en móvil
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Mostrar confirmación visual
        this.mostrarConfirmacion('Medición guardada exitosamente');
        
        this.renderCharts();
        this.renderHistorial();
        document.getElementById('parametros-form').reset();
        this.setFechaActual();
    }
    
    mostrarConfirmacion(mensaje) {
        const toast = document.createElement('div');
        toast.textContent = mensaje;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    renderCharts() {
        const chartsContainer = document.getElementById('charts');
        chartsContainer.innerHTML = '';
        
        if (this.parametros.length === 0) {
            chartsContainer.innerHTML = '<div class="no-data">📊 Toca "Datos Ejemplo" para ver los gráficos</div>';
            return;
        }

        const parametrosConfig = {
            densidad: { label: 'Densidad', color: '#FF6B6B' },
            kh: { label: 'KH (dKH)', color: '#4ECDC4' },
            calcio: { label: 'Calcio (ppm)', color: '#45B7D1' },
            magnesio: { label: 'Magnesio (ppm)', color: '#96CEB4' },
            nitratos: { label: 'Nitratos (ppm)', color: '#FFEAA7' },
            fosfatos: { label: 'Fosfatos (ppm)', color: '#DDA0DD' },
            temperatura: { label: 'Temperatura (°C)', color: '#FFB347' }
        };
        
        Object.keys(parametrosConfig).forEach(param => {
            const config = parametrosConfig[param];
            const data = this.parametros
                .filter(p => p[param] !== null && p[param] !== undefined)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            
            if (data.length === 0) return;

            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart-item';
            
            // Crear gráfico simple con SVG
            const svgChart = this.createSimpleChart(data, param, config);
            
            chartDiv.innerHTML = `
                <h4>${config.label}</h4>
                <div class="simple-chart">
                    ${svgChart}
                </div>
                <div class="chart-values">
                    Último: <strong>${data[data.length-1][param]}</strong> | 
                    Promedio: <strong>${(data.reduce((sum, d) => sum + d[param], 0) / data.length).toFixed(2)}</strong>
                </div>
            `;
            chartsContainer.appendChild(chartDiv);
        });
    }
    
    createSimpleChart(data, param, config) {
        const width = 280;
        const height = 80;
        const padding = 20;
        
        const values = data.map(d => d[param]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = maxVal - minVal || 1;
        
        let points = '';
        data.forEach((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
            const y = height - padding - ((d[param] - minVal) / range) * (height - 2 * padding);
            points += `${x},${y} `;
        });
        
        return `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="background: white; border-radius: 4px; border: 1px solid #eee;">
                <!-- Data line -->
                <polyline points="${points}" fill="none" stroke="${config.color}" stroke-width="2" stroke-linejoin="round"/>
                
                <!-- Data points -->
                ${data.map((d, i) => {
                    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
                    const y = height - padding - ((d[param] - minVal) / range) * (height - 2 * padding);
                    return `<circle cx="${x}" cy="${y}" r="2" fill="${config.color}"/>`;
                }).join('')}
            </svg>
        `;
    }
    
    getParameterStatus(value, config) {
        if (value >= config.ideal[0] && value <= config.ideal[1]) {
            return { class: 'status-good', text: '✅ Óptimo' };
        } else if (value >= config.min && value <= config.max) {
            return { class: 'status-warning', text: '⚠️ Aceptable' };
        } else {
            return { class: 'status-danger', text: '❌ Fuera de rango' };
        }
    }

    renderHistorial() {
        const historialContainer = document.getElementById('historial');
        const historialOrdenado = [...this.parametros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        historialContainer.innerHTML = historialOrdenado.map(p => `
            <div class="historial-item">
                <div class="historial-date">${new Date(p.fecha).toLocaleDateString()}</div>
                <div class="historial-params">
                    ${p.densidad ? `<div class="param-item">Densidad: ${p.densidad}</div>` : ''}
                    ${p.kh ? `<div class="param-item">KH: ${p.kh}</div>` : ''}
                    ${p.calcio ? `<div class="param-item">Ca: ${p.calcio} ppm</div>` : ''}
                    ${p.magnesio ? `<div class="param-item">Mg: ${p.magnesio} ppm</div>` : ''}
                    ${p.nitratos ? `<div class="param-item">NO₃: ${p.nitratos} ppm</div>` : ''}
                    ${p.fosfatos ? `<div class="param-item">PO₄: ${p.fosfatos} ppm</div>` : ''}
                    ${p.temperatura ? `<div class="param-item">Temp: ${p.temperatura}°C</div>` : ''}
                </div>
                ${p.notas ? `<div class="historial-notas">${p.notas}</div>` : ''}
            </div>
        `).join('');
    }

    renderFotos() {
        Object.keys(this.fotos).forEach(especie => {
            const grid = document.getElementById(`grid-${especie}`);
            const fotosOrdenadas = [...this.fotos[especie]].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            
            grid.innerHTML = fotosOrdenadas.map(foto => `
                <div class="photo-item" onclick="app.mostrarFoto('${foto.src}', '${foto.fecha}')">
                    <img src="${foto.src}" alt="Coral ${especie}">
                    <div class="photo-date">${new Date(foto.fecha).toLocaleDateString()}</div>
                </div>
            `).join('');
        });
    }

    mostrarFoto(src, fecha) {
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const modalDate = document.getElementById('modal-date');
        
        modal.style.display = 'block';
        modalImg.src = src;
        modalDate.textContent = new Date(fecha).toLocaleDateString();
    }
}

function cargarFoto(especie) {
    const fileInput = document.getElementById('file-input');
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Feedback táctil
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const foto = {
                    src: e.target.result,
                    fecha: new Date().toISOString(),
                    especie: especie
                };
                
                app.fotos[especie].push(foto);
                localStorage.setItem('fotos', JSON.stringify(app.fotos));
                app.renderFotos();
                
                // Confirmación visual
                app.mostrarConfirmacion('Foto guardada exitosamente');
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
}

const app = new CoralTrack();