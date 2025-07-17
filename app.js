class CoralTrack {
    constructor() {
        this.parametros = JSON.parse(localStorage.getItem('parametros')) || [];
        this.fotos = JSON.parse(localStorage.getItem('fotos')) || {};
        this.inventario = JSON.parse(localStorage.getItem('inventario')) || [];
        this.eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        
        // Asegurar que ambas especies existen
        if (!this.fotos.pachyclavularia) this.fotos.pachyclavularia = [];
        if (!this.fotos.palythoa) this.fotos.palythoa = [];
        
        this.charts = {};
        this.renderTimeout = null;
        
        // No cargar datos automáticamente
        
        this.init();
    }
    
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.renderTimeout);
            this.renderTimeout = setTimeout(() => func.apply(this, args), wait);
        };
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
        this.setupBioTabs();
        this.setupModal();
        this.setupPhotoModal();
        this.setFechaActual();
        this.renderDashboard();
        this.renderCharts();
        this.renderHistorial();
        this.renderFotos();
        this.renderAvanzado();
        this.renderBiologico();
        this.checkAlerts();
        this.setupReminders();

        
        // Crear función de render optimizada
        this.debouncedRender = this.debounce(() => {
            this.renderDashboard();
            this.renderCharts();
            this.renderHistorial();
            this.checkAlerts();
        }, 300);
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Tab clicked:', e.target.dataset.tab);
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                const targetSection = document.getElementById(e.target.dataset.tab);
                if (targetSection) {
                    targetSection.classList.add('active');
                } else {
                    console.error('Section not found:', e.target.dataset.tab);
                }
            });
        });
    }

    setupForm() {
        document.getElementById('parametros-form').addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            this.guardarParametros();
        });
        

        
        document.getElementById('exportar-datos').addEventListener('click', () => {
            this.exportarDatos();
        });
        
        document.getElementById('importar-datos').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        // Botón debug para reparar especies
        if (document.getElementById('debug-especies')) {
            document.getElementById('debug-especies').addEventListener('click', () => {
                this.repararEspecies();
            });
        }
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importarDatos(e.target.files[0]);
        });
        
        // Botón limpiar todo eliminado
        

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
    
    setupPhotoModal() {
        document.getElementById('guardar-foto-nota').addEventListener('click', () => {
            this.guardarFotoConNota();
        });
        
        document.getElementById('cancelar-nota').addEventListener('click', () => {
            this.cancelarNota();
        });
    }

    guardarParametros() {
        console.log('Guardando parámetros...');
        
        // Validación manual de fecha
        const fecha = document.getElementById('fecha').value;
        if (!fecha) {
            alert('Por favor selecciona una fecha');
            return;
        }
        
        const formData = new FormData(document.getElementById('parametros-form'));
        const parametro = {};
        
        for (let [key, value] of formData.entries()) {
            parametro[key] = key === 'fecha' || key === 'notas' ? value : parseFloat(value) || null;
        }
        
        console.log('Parámetro a guardar:', parametro);
        
        this.parametros.push(parametro);
        localStorage.setItem('parametros', JSON.stringify(this.parametros));
        console.log('Total parámetros:', this.parametros.length);
        
        // Feedback táctil en móvil
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Mostrar confirmación visual
        this.mostrarConfirmacion('Medición guardada exitosamente');
        
        this.debouncedRender();
        this.renderHistorial();
        document.getElementById('parametros-form').reset();
        this.setFechaActual();
        
        // Volver al paso 1
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
        document.querySelector('[data-step="2"]').classList.remove('active');
        document.querySelector('[data-step="1"]').classList.add('active');
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
            chartsContainer.innerHTML = '<div class="no-data">📊 Agrega tu primera medición para ver los gráficos</div>';
            return;
        }
        
        console.log('Renderizando gráficos con', this.parametros.length, 'mediciones');

        const configs = {
            densidad: { label: 'Densidad', color: '#FF6B6B' },
            kh: { label: 'KH (dKH)', color: '#4ECDC4' },
            calcio: { label: 'Calcio (ppm)', color: '#45B7D1' },
            magnesio: { label: 'Magnesio (ppm)', color: '#96CEB4' },
            nitratos: { label: 'Nitratos (ppm)', color: '#FFEAA7' },
            fosfatos: { label: 'Fosfatos (ppm)', color: '#DDA0DD' },
            temperatura: { label: 'Temperatura (°C)', color: '#FFB347' }
        };
        
        let html = '';
        Object.keys(configs).forEach(param => {
            const config = configs[param];
            const ultimo = this.parametros[this.parametros.length - 1][param];
            if (ultimo) {
                const valores = this.parametros.map(p => p[param]).filter(v => v);
                const promedio = (valores.reduce((sum, v) => sum + v, 0) / valores.length);
                const tendencia = valores.length >= 3 ? (ultimo > valores[valores.length-3] ? '📈' : ultimo < valores[valores.length-3] ? '📉' : '➡️') : '➡️';
                const estado = this.getEstado(param, ultimo);
                
                const chartId = `static-chart-${param}`;
                const rangeBar = this.createRangeBar(param, ultimo);
                
                html += `
                    <div onclick="app.expandirGrafico('${param}', '${config.label}', '${config.color}')" style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 5px solid ${config.color}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; width: 100%; height: 120px; max-height: 120px; overflow: hidden; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0; font-size: 16px; color: #333;">${config.label}</h3>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button onclick="event.stopPropagation(); app.mostrarCalculadora('${param}', '${config.label}', ${ultimo})" style="width: 24px; height: 24px; border-radius: 50%; background: #2196F3; color: white; border: none; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🧮</button>
                                <button onclick="event.stopPropagation(); app.agregarNotaParametro('${param}', '${config.label}')" style="width: 24px; height: 24px; border-radius: 50%; background: ${config.color}; color: white; border: none; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                                <span style="font-size: 18px;">${tendencia}</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: ${estado.color}; margin-bottom: 5px;">${ultimo}</div>
                                <div style="font-size: 11px; padding: 3px 6px; border-radius: 10px; background: ${estado.bg}; color: ${estado.color};">${estado.text}</div>
                            </div>
                            <div style="text-align: right; width: 120px; height: 60px; position: relative;">
                                ${this.createStaticChart(valores, config.color)}
                                <div style="font-size: 11px; color: #666; margin-top: 3px;">${valores.length} med</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 10px;">
                            ${rangeBar}
                        </div>
                    </div>
                `;
            }
        });
        
        chartsContainer.innerHTML = html;
        chartsContainer.style.display = 'block';
        chartsContainer.style.visibility = 'visible';
        chartsContainer.style.opacity = '1';
        chartsContainer.style.height = 'auto';
        chartsContainer.style.overflow = 'visible';
        
        // Solo crear gráficos detallados (los del dashboard ya son SVG estáticos)
        setTimeout(() => {
            this.createDetailedCharts(configs);
        }, 100);
    }
    

    
    getTendencia(valores) {
        if (valores.length < 3) return { class: 'neutral', icon: '➡️' };
        
        const ultimos3 = valores.slice(-3);
        const primero = ultimos3[0];
        const ultimo = ultimos3[ultimos3.length - 1];
        const cambio = ((ultimo - primero) / primero) * 100;
        
        if (cambio > 2) return { class: 'up', icon: '📈' };
        if (cambio < -2) return { class: 'down', icon: '📉' };
        return { class: 'stable', icon: '➡️' };
    }
    
    getEstado(param, valor) {
        const rangos = {
            densidad: { min: 1.024, max: 1.026 },
            kh: { min: 8, max: 10 },
            calcio: { min: 400, max: 450 },
            magnesio: { min: 1300, max: 1400 },
            nitratos: { min: 0, max: 10 },
            fosfatos: { min: 0, max: 0.05 },
            temperatura: { min: 24, max: 26 }
        };
        
        const rango = rangos[param];
        if (!rango) return { color: '#666', bg: '#f5f5f5', text: 'OK' };
        
        if (valor >= rango.min && valor <= rango.max) {
            return { color: '#4CAF50', bg: '#E8F5E8', text: 'Óptimo' };
        } else if (valor >= rango.min * 0.9 && valor <= rango.max * 1.1) {
            return { color: '#FF9800', bg: '#FFF3E0', text: 'Aceptable' };
        } else {
            return { color: '#f44336', bg: '#FFEBEE', text: 'Revisar' };
        }
    }
    
    createStaticChart(valores, color) {
        if (valores.length < 2) return '<div style="width: 120px; height: 60px; background: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">Sin datos</div>';
        
        const ultimos = valores.slice(-10); // Últimos 10 puntos
        const min = Math.min(...ultimos);
        const max = Math.max(...ultimos);
        const range = max - min || 1;
        
        let points = '';
        ultimos.forEach((val, i) => {
            const x = (i * 110) / (ultimos.length - 1) + 5;
            const y = 50 - ((val - min) / range) * 40;
            points += `${x},${y} `;
        });
        
        return `
            <svg width="120" height="60" style="border-radius: 4px; background: #f9f9f9; pointer-events: none;">
                <defs>
                    <linearGradient id="grad-${color.replace('#', '')}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <polygon points="5,50 ${points}115,50" fill="url(#grad-${color.replace('#', '')})" />
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
                ${ultimos.map((val, i) => {
                    const x = (i * 110) / (ultimos.length - 1) + 5;
                    const y = 50 - ((val - min) / range) * 40;
                    return `<circle cx="${x}" cy="${y}" r="2" fill="${color}"/>`;
                }).join('')}
            </svg>
        `;
    }
    
    createRangeBar(param, valor) {
        const rangos = {
            densidad: { min: 1.020, max: 1.030, optimal: [1.024, 1.026] },
            kh: { min: 6, max: 12, optimal: [8, 10] },
            calcio: { min: 350, max: 500, optimal: [400, 450] },
            magnesio: { min: 1200, max: 1500, optimal: [1300, 1400] },
            nitratos: { min: 0, max: 20, optimal: [0, 10] },
            fosfatos: { min: 0, max: 0.15, optimal: [0, 0.05] },
            temperatura: { min: 22, max: 28, optimal: [24, 26] }
        };
        
        const rango = rangos[param];
        if (!rango) return '';
        
        const total = rango.max - rango.min;
        const optimalStart = ((rango.optimal[0] - rango.min) / total) * 100;
        const optimalWidth = ((rango.optimal[1] - rango.optimal[0]) / total) * 100;
        const valorPos = ((valor - rango.min) / total) * 100;
        
        return `
            <div style="position: relative; height: 8px; background: #ffebee; border-radius: 4px; overflow: hidden;">
                <div style="position: absolute; left: 0; width: ${optimalStart}%; height: 100%; background: #fff3e0;"></div>
                <div style="position: absolute; left: ${optimalStart}%; width: ${optimalWidth}%; height: 100%; background: #e8f5e8;"></div>
                <div style="position: absolute; left: ${optimalStart + optimalWidth}%; width: ${100 - optimalStart - optimalWidth}%; height: 100%; background: #fff3e0;"></div>
                <div style="position: absolute; left: ${Math.max(0, Math.min(100, valorPos))}%; top: -2px; width: 3px; height: 12px; background: #333; border-radius: 2px;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #999; margin-top: 2px;">
                <span>${rango.min}</span>
                <span style="color: #4CAF50;">${rango.optimal[0]}-${rango.optimal[1]}</span>
                <span>${rango.max}</span>
            </div>
        `;
    }
    
    // Función eliminada - ahora usamos SVG estáticos
    
    createDetailedCharts(configs) {
        const container = document.getElementById('detailed-charts-container');
        if (!container || this.parametros.length < 2) return;
        
        let html = '';
        Object.keys(configs).forEach(param => {
            const config = configs[param];
            const valores = this.parametros.map(p => p[param]).filter(v => v !== null && v !== undefined);
            
            if (valores.length >= 2) {
                html += `
                    <div class="collapsible-chart" data-param="${param}" style="background: white; margin-bottom: 2px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 3px solid ${config.color};">
                        <div class="chart-header" onclick="app.toggleChart('${param}')" style="padding: 8px 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                            <h4 style="margin: 0; color: #333; font-size: 0.8rem; font-weight: 600;">
                                ${config.label}
                            </h4>
                            <span class="toggle-icon" style="font-size: 18px; color: #333; font-weight: bold;">▼</span>
                        </div>
                        <div class="chart-content" style="display: none; padding: 0 12px 12px;">
                            <div onclick="app.expandirGrafico('${param}', '${config.label}', '${config.color}')" style="height: 80px; position: relative; cursor: pointer;">
                                <canvas id="detailed-chart-${param}"></canvas>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
        
        setTimeout(() => {
            Object.keys(configs).forEach(param => {
                const config = configs[param];
                const canvas = document.getElementById(`detailed-chart-${param}`);
                
                if (!canvas) return;
                
                const parametrosConFecha = this.parametros.filter(p => p[param] !== null && p[param] !== undefined);
                const valores = parametrosConFecha.map(p => p[param]);
                const fechas = parametrosConFecha.map(p => p.fecha.split('-').reverse().join('/'));
                
                if (valores.length < 2) return;
                
                const ctx = canvas.getContext('2d');
                
                // Escalas Y fijas por parámetro
                const escalasY = {
                    densidad: { min: 1.0245, max: 1.0255 },
                    kh: { min: 6, max: 12 },
                    calcio: { min: 350, max: 500 },
                    magnesio: { min: 1200, max: 1500 },
                    nitratos: { min: 0, max: 25 },
                    fosfatos: { min: 0, max: 0.15 },
                    temperatura: { min: 22, max: 28 }
                };
                
                const escalaY = escalasY[param];
                
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: fechas,
                        datasets: [{
                            label: config.label,
                            data: valores,
                            borderColor: config.color,
                            backgroundColor: config.color + '15',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 5,
                            pointBackgroundColor: config.color,
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        devicePixelRatio: window.devicePixelRatio || 1,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: true,
                                mode: 'nearest',
                                intersect: false,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                cornerRadius: 6,
                                padding: 8,
                                titleFont: { size: 10 },
                                bodyFont: { size: 9 },
                                displayColors: false,
                                caretSize: 4
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: '#f0f0f0' },
                                ticks: { maxTicksLimit: 4, color: '#666', font: { size: 10 } }
                            },
                            y: {
                                grid: { color: '#f0f0f0' },
                                ticks: { color: '#666', font: { size: 10 }, maxTicksLimit: 5 },
                                min: escalaY ? escalaY.min : undefined,
                                max: escalaY ? escalaY.max : undefined,
                                min: escalaY ? escalaY.min : undefined,
                                max: escalaY ? escalaY.max : undefined,
                                beginAtZero: false
                            }
                        }
                    }
                });
            });
        }, 200);
    }

    renderHistorial() {
        const historialContainer = document.getElementById('historial');
        const historialOrdenado = [...this.parametros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        historialContainer.innerHTML = historialOrdenado.map((p, index) => `
            <div class="historial-item">
                <div class="historial-header">
                    <div class="historial-date">${p.fecha.split('-').reverse().join('/')}</div>
                    <div class="historial-actions">
                        <button class="btn-edit" onclick="app.editarMedicion(${this.parametros.indexOf(p)})" title="Editar">✏️</button>
                        <button class="btn-delete" onclick="app.eliminarMedicion(${this.parametros.indexOf(p)})" title="Eliminar">🗑️</button>
                    </div>
                </div>
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
            if (!grid) return;
            
            const fotosOrdenadas = [...this.fotos[especie]];
            
            grid.innerHTML = fotosOrdenadas.map((foto, index) => `
                <div class="photo-item" data-index="${index}" data-especie="${especie}">
                    <img src="${foto.src}" alt="Coral ${especie}" loading="lazy" draggable="false">
                    <div class="photo-overlay">
                        <div class="photo-date">${foto.fecha.split('T')[0].split('-').reverse().join('/')}</div>
                        ${foto.nota ? `<div class="photo-note-preview">📝 ${foto.nota.substring(0, 30)}${foto.nota.length > 30 ? '...' : ''}</div>` : ''}
                    </div>
                    <div class="photo-actions" style="opacity: 0; transition: opacity 0.3s;">
                        <button class="photo-delete photo-delete-corner" onclick="event.stopPropagation(); app.eliminarFoto('${especie}', ${index})" title="Eliminar">×</button>
                        <div class="photo-actions-column">
                            <button class="photo-edit-note" onclick="event.stopPropagation(); app.editarNota('${especie}', ${index})" title="Editar nota">📝</button>
                            <button class="photo-edit" onclick="event.stopPropagation(); app.editarFoto('${especie}', ${index})" title="Cambiar foto">📷</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Configurar drag and drop
            this.setupDragAndDrop(grid, especie);
            

        });
    }

    mostrarFoto(src, fecha, nota = '') {
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const modalDate = document.getElementById('modal-date');
        const modalNote = document.getElementById('modal-note');
        
        modal.style.display = 'block';
        modalImg.src = src;
        modalDate.textContent = fecha.split('T')[0].split('-').reverse().join('/');
        modalNote.textContent = nota || 'Sin notas';
    }
    
    cargarFoto(especie) {
        const fileInput = document.getElementById('file-input');
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Feedback táctil
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                // Comprimir imagen antes de guardar
                this.comprimirImagen(file, (imagenComprimida) => {
                    this.tempFotoData = {
                        src: imagenComprimida,
                        fecha: new Date().toISOString(),
                        especie: especie
                    };
                    
                    // Mostrar modal para agregar nota
                    document.getElementById('photo-note-modal').style.display = 'flex';
                    document.getElementById('photo-note-input').focus();
                });
            }
        };
        fileInput.click();
    }
    
    guardarFotoConNota() {
        console.log('Guardando foto con nota...');
        const nota = document.getElementById('photo-note-input').value.trim();
        console.log('Nota:', nota);
        console.log('TempFotoData:', this.tempFotoData);
        
        if (this.tempFotoData) {
            const foto = {
                src: this.tempFotoData.src,
                fecha: this.tempFotoData.fecha,
                especie: this.tempFotoData.especie,
                nota: nota || 'Sin nota'
            };
            
            console.log('Foto a guardar:', foto);
            console.log('Estado actual fotos:', this.fotos);
            
            // Asegurar que el array existe
            if (!this.fotos[foto.especie]) {
                this.fotos[foto.especie] = [];
                console.log('Creado array para especie:', foto.especie);
            }
            
            this.fotos[foto.especie].push(foto);
            
            try {
                localStorage.setItem('fotos', JSON.stringify(this.fotos));
                console.log('Foto guardada en localStorage');
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    alert('⚠️ Espacio de almacenamiento lleno. Elimina algunas fotos antiguas.');
                    // Remover la foto que acabamos de agregar
                    this.fotos[foto.especie].pop();
                    return;
                } else {
                    throw error;
                }
            }
            
            this.renderFotos();
            
            // Limpiar datos temporales
            this.tempFotoData = null;
            document.getElementById('photo-note-input').value = '';
            document.getElementById('photo-note-modal').style.display = 'none';
            
            this.mostrarConfirmacion('📷 Foto guardada exitosamente');
        } else {
            console.error('No hay datos temporales de foto');
            alert('Error: No hay foto para guardar');
        }
    }
    
    cancelarNota() {
        this.tempFotoData = null;
        document.getElementById('photo-note-input').value = '';
        document.getElementById('photo-note-modal').style.display = 'none';
    }
    
    eliminarFoto(especie, index) {
        if (confirm('¿Eliminar esta foto?')) {
            this.fotos[especie].splice(index, 1);
            localStorage.setItem('fotos', JSON.stringify(this.fotos));
            this.renderFotos();
            this.mostrarConfirmacion('🗑️ Foto eliminada');
        }
    }
    
    editarNota(especie, index) {
        const foto = this.fotos[especie][index];
        const nuevaNota = prompt('📝 Editar nota:', foto.nota || '');
        
        if (nuevaNota !== null) {
            this.fotos[especie][index].nota = nuevaNota.trim();
            localStorage.setItem('fotos', JSON.stringify(this.fotos));
            this.renderFotos();
            this.mostrarConfirmacion('📝 Nota actualizada');
        }
    }
    
    editarFoto(especie, index) {
        const fileInput = document.getElementById('file-input');
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.comprimirImagen(file, (imagenComprimida) => {
                    this.fotos[especie][index].src = imagenComprimida;
                    localStorage.setItem('fotos', JSON.stringify(this.fotos));
                    this.renderFotos();
                    this.mostrarConfirmacion('📷 Foto actualizada');
                });
            }
        };
        fileInput.click();
    }
    
    setupDragAndDrop(grid, especie) {
        const photos = grid.querySelectorAll('.photo-item');
        
        photos.forEach(photo => {
            let startPos = null;
            let hasMoved = false;
            let draggedOver = null;
            let longPressTimer = null;
            let isLongPress = false;
            
            photo.addEventListener('touchstart', (e) => {
                if (e.target.closest('.photo-actions')) return;
                
                startPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                hasMoved = false;
                draggedOver = null;
                isLongPress = false;
                
                // Iniciar timer para long press
                longPressTimer = setTimeout(() => {
                    if (!hasMoved) {
                        isLongPress = true;
                        // Mostrar botones de acción
                        const actions = photo.querySelector('.photo-actions');
                        if (actions) {
                            actions.style.opacity = '1';
                            // Vibrar si está disponible
                            if (navigator.vibrate) {
                                navigator.vibrate(50);
                            }
                        }
                    }
                }, 500); // 500ms para long press
            });
            
            photo.addEventListener('touchmove', (e) => {
                if (!startPos) return;
                
                // Prevenir scroll durante el arrastre
                e.preventDefault();
                
                const deltaX = Math.abs(e.touches[0].clientX - startPos.x);
                const deltaY = Math.abs(e.touches[0].clientY - startPos.y);
                
                if (deltaX > 15 || deltaY > 15) {
                    hasMoved = true;
                    // Cancelar long press si hay movimiento
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                    
                    // Ocultar botones si estaban visibles
                    const actions = photo.querySelector('.photo-actions');
                    if (actions) {
                        actions.style.opacity = '0';
                    }
                    
                    // Prevenir scroll del contenedor
                    const tabContent = document.getElementById('galeria');
                    if (tabContent) {
                        tabContent.style.overflow = 'hidden';
                    }
                    
                    photo.style.opacity = '0.7';
                    photo.style.zIndex = '1000';
                    photo.style.transform = `translate(${e.touches[0].clientX - startPos.x}px, ${e.touches[0].clientY - startPos.y}px) scale(1.05)`;
                    
                    // Detectar foto destino
                    photo.style.pointerEvents = 'none';
                    const dropTarget = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)?.closest('.photo-item');
                    photo.style.pointerEvents = '';
                    
                    // Limpiar highlight anterior
                    if (draggedOver && draggedOver !== dropTarget) {
                        draggedOver.style.backgroundColor = '';
                    }
                    
                    // Highlight nueva foto
                    if (dropTarget && dropTarget !== photo) {
                        dropTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.3)';
                        draggedOver = dropTarget;
                    } else {
                        draggedOver = null;
                    }
                }
            });
            
            photo.addEventListener('touchend', (e) => {
                // Limpiar timer
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                
                if (!startPos) return;
                
                // Limpiar highlight
                if (draggedOver) {
                    draggedOver.style.backgroundColor = '';
                }
                
                if (hasMoved && draggedOver) {
                    const dragIndex = parseInt(photo.dataset.index);
                    const dropIndex = parseInt(draggedOver.dataset.index);
                    
                    if (dragIndex !== dropIndex && dragIndex >= 0 && dropIndex >= 0) {
                        // Intercambiar en el array
                        const temp = this.fotos[especie][dragIndex];
                        this.fotos[especie][dragIndex] = this.fotos[especie][dropIndex];
                        this.fotos[especie][dropIndex] = temp;
                        
                        localStorage.setItem('fotos', JSON.stringify(this.fotos));
                        this.mostrarConfirmacion('🔄 Fotos intercambiadas');
                        
                        // Re-renderizar inmediatamente
                        setTimeout(() => this.renderFotos(), 50);
                        return;
                    }
                } else if (!hasMoved && !isLongPress) {
                    // Solo clic corto, abrir foto
                    const fotoData = this.fotos[especie][parseInt(photo.dataset.index)];
                    if (fotoData) {
                        this.mostrarFoto(fotoData.src, fotoData.fecha, fotoData.nota || '');
                    }
                }
                
                // Restaurar estado
                photo.style.opacity = '1';
                photo.style.transform = 'scale(1)';
                photo.style.zIndex = '';
                photo.style.pointerEvents = '';
                
                // Restaurar scroll
                const tabContent = document.getElementById('galeria');
                if (tabContent) {
                    tabContent.style.overflow = '';
                }
                
                startPos = null;
                hasMoved = false;
                draggedOver = null;
                isLongPress = false;
            });
            
            // Ocultar botones al tocar fuera
            document.addEventListener('touchstart', (e) => {
                if (!photo.contains(e.target)) {
                    const actions = photo.querySelector('.photo-actions');
                    if (actions) {
                        actions.style.opacity = '0';
                    }
                }
            });
        });
    }
    

    
    comprimirImagen(file, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Redimensionar a máximo 800px manteniendo proporción
            const maxSize = 800;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a base64 con calidad reducida
            const imagenComprimida = canvas.toDataURL('image/jpeg', 0.7);
            callback(imagenComprimida);
        };
        
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    agregarEspecie() {
        const nombreEspecie = prompt('🐠 Nombre de la nueva especie de coral:', '').trim();
        
        if (!nombreEspecie) return;
        
        // Convertir a formato válido (sin espacios, minúsculas)
        const especieId = nombreEspecie.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        if (this.fotos[especieId]) {
            alert('⚠️ Esta especie ya existe');
            return;
        }
        
        // Crear nueva especie
        this.fotos[especieId] = [];
        localStorage.setItem('fotos', JSON.stringify(this.fotos));
        
        // Agregar pestaña
        this.crearTabEspecie(especieId, nombreEspecie);
        
        // Crear contenido
        this.crearContenidoEspecie(especieId, nombreEspecie);
        
        // Activar nueva pestaña
        this.activarEspecie(especieId);
        
        this.mostrarConfirmacion(`🎉 Especie "${nombreEspecie}" agregada`);
    }
    
    crearTabEspecie(especieId, nombreEspecie) {
        const tabsContainer = document.querySelector('.coral-tabs');
        const addButton = tabsContainer.querySelector('.add-species');
        
        // Verificar si ya existe para evitar duplicados
        if (document.querySelector(`[data-coral="${especieId}"]`)) {
            return;
        }
        
        const newTab = document.createElement('button');
        newTab.className = 'coral-tab';
        newTab.setAttribute('data-coral', especieId);
        newTab.innerHTML = `${nombreEspecie} <span class="delete-species" onclick="event.stopPropagation(); app.eliminarEspecie('${especieId}');">×</span>`;
        
        // Insertar antes del botón de agregar
        tabsContainer.insertBefore(newTab, addButton);
        
        // Agregar event listener
        newTab.addEventListener('click', () => {
            this.activarEspecie(especieId);
        });
    }
    
    crearContenidoEspecie(especieId, nombreEspecie) {
        const galeriaSection = document.getElementById('galeria');
        
        const newContent = document.createElement('div');
        newContent.id = especieId;
        newContent.className = 'coral-content';
        newContent.innerHTML = `
            <div class="photo-grid" id="grid-${especieId}"></div>
            <button class="btn-add-photo" onclick="app.cargarFoto('${especieId}')">📷 Agregar Foto</button>
        `;
        
        galeriaSection.appendChild(newContent);
    }
    
    activarEspecie(especieId) {
        // Desactivar todas las pestañas y contenidos
        document.querySelectorAll('.coral-tab').forEach(tab => {
            if (!tab.classList.contains('add-species')) {
                tab.classList.remove('active');
            }
        });
        document.querySelectorAll('.coral-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activar la nueva
        document.querySelector(`[data-coral="${especieId}"]`).classList.add('active');
        document.getElementById(especieId).classList.add('active');
        
        this.renderFotos();
    }
    
    eliminarEspecie(especieId) {
        if (especieId === 'pachyclavularia' || especieId === 'palythoa') {
            alert('⚠️ No puedes eliminar las especies predeterminadas');
            return;
        }
        
        if (!confirm('¿Eliminar la especie y todas sus fotos?')) return;
        
        // Eliminar datos
        delete this.fotos[especieId];
        localStorage.setItem('fotos', JSON.stringify(this.fotos));
        
        // Eliminar elementos del DOM
        document.querySelector(`[data-coral="${especieId}"]`).remove();
        document.getElementById(especieId).remove();
        
        // Activar primera pestaña
        this.activarEspecie('pachyclavularia');
        
        this.mostrarConfirmacion('🗑️ Especie eliminada');
    }
    
    renderDashboard() {
        const dashboard = document.getElementById('dashboard');
        
        if (this.parametros.length === 0) {
            dashboard.innerHTML = '';
            return;
        }
        
        const ultimaMedicion = this.parametros[this.parametros.length - 1];
        const score = this.calcularScore(ultimaMedicion);
        const alertas = this.getAlertas(ultimaMedicion);
        const resumen = this.getResumenGeneral(ultimaMedicion);
        
        dashboard.innerHTML = `
            ${this.createWidgetResumen(resumen, score)}
            
            <div class="dashboard-header">
                <div class="health-score ${score.class}">
                    <div class="score-circle">
                        <span class="score-number">${score.value}</span>
                        <span class="score-label">Score</span>
                    </div>
                    <div class="score-status">
                        ${score.icon} ${score.text}
                    </div>
                </div>
                
                <div class="quick-stats">
                    <div class="stat-item">
                        <span class="stat-label">Última medición</span>
                        <span class="stat-value">${new Date(ultimaMedicion.fecha).toLocaleDateString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total mediciones</span>
                        <span class="stat-value">${this.parametros.length}</span>
                    </div>
                </div>
            </div>
            
            ${alertas.length > 0 ? `
                <div class="alerts-section">
                    <h4>🔔 Alertas Activas</h4>
                    ${alertas.map(alerta => `
                        <div class="alert ${alerta.type}">
                            ${alerta.icon} <span>${alerta.message}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<div class="no-alerts">✅ Todo en orden - Sin alertas activas</div>'}
        `;
    }
    
    calcularScore(medicion) {
        const rangos = {
            densidad: { min: 1.024, max: 1.026, peso: 15 },
            kh: { min: 8, max: 10, peso: 20 },
            calcio: { min: 400, max: 450, peso: 15 },
            magnesio: { min: 1300, max: 1400, peso: 10 },
            nitratos: { min: 0, max: 10, peso: 20 },
            fosfatos: { min: 0, max: 0.05, peso: 15 },
            temperatura: { min: 24, max: 26, peso: 5 }
        };
        
        let scoreTotal = 0;
        let pesoTotal = 0;
        
        Object.keys(rangos).forEach(param => {
            if (medicion[param] !== null && medicion[param] !== undefined) {
                const valor = medicion[param];
                const rango = rangos[param];
                let puntos = 0;
                
                if (valor >= rango.min && valor <= rango.max) {
                    puntos = 100; // Perfecto
                } else if (valor >= rango.min * 0.9 && valor <= rango.max * 1.1) {
                    puntos = 70; // Aceptable
                } else {
                    puntos = 30; // Fuera de rango
                }
                
                scoreTotal += puntos * rango.peso;
                pesoTotal += rango.peso;
            }
        });
        
        const score = Math.round(scoreTotal / pesoTotal);
        
        if (score >= 85) {
            return { value: score, class: 'excellent', icon: '🐟', text: 'Excelente' };
        } else if (score >= 70) {
            return { value: score, class: 'good', icon: '🐠', text: 'Bueno' };
        } else if (score >= 50) {
            return { value: score, class: 'warning', icon: '⚠️', text: 'Atención' };
        } else {
            return { value: score, class: 'critical', icon: '❌', text: 'Crítico' };
        }
    }
    
    getAlertas(medicion) {
        const alertas = [];
        
        // Alertas por parámetros fuera de rango
        if (medicion.densidad && (medicion.densidad < 1.023 || medicion.densidad > 1.027)) {
            alertas.push({
                type: 'warning',
                icon: '⚠️',
                message: `Densidad en ${medicion.densidad} - Rango óptimo: 1.024-1.026`
            });
        }
        
        if (medicion.kh && (medicion.kh < 7 || medicion.kh > 11)) {
            alertas.push({
                type: 'warning',
                icon: '⚠️',
                message: `KH en ${medicion.kh} - Rango óptimo: 8-10 dKH`
            });
        }
        
        if (medicion.nitratos && medicion.nitratos > 15) {
            alertas.push({
                type: 'danger',
                icon: '🚨',
                message: `Nitratos altos: ${medicion.nitratos} ppm - Cambio de agua recomendado`
            });
        }
        
        if (medicion.fosfatos && medicion.fosfatos > 0.1) {
            alertas.push({
                type: 'danger',
                icon: '🚨',
                message: `Fosfatos altos: ${medicion.fosfatos} ppm - Revisar filtrado`
            });
        }
        
        // Alerta de recordatorio de medición
        const diasSinMedir = Math.floor((Date.now() - new Date(medicion.fecha).getTime()) / (1000 * 60 * 60 * 24));
        if (diasSinMedir > 7) {
            alertas.push({
                type: 'info',
                icon: '📅',
                message: `Han pasado ${diasSinMedir} días desde la última medición`
            });
        }
        
        return alertas;
    }
    
    checkAlerts() {
        if (this.parametros.length === 0) return;
        
        const ultimaMedicion = this.parametros[this.parametros.length - 1];
        const alertas = this.getAlertas(ultimaMedicion);
        const alertasCriticas = alertas.filter(a => a.type === 'danger');
        
        if (alertasCriticas.length > 0 && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('CoralTrack - Alerta Crítica', {
                    body: alertasCriticas[0].message,
                    icon: 'icon-192.png'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('CoralTrack - Alerta Crítica', {
                            body: alertasCriticas[0].message,
                            icon: 'icon-192.png'
                        });
                    }
                });
            }
        }
    }
    
    setupReminders() {
        // Solicitar permisos de notificación
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        // Verificar recordatorios cada hora
        setInterval(() => {
            this.checkReminders();
        }, 60 * 60 * 1000); // 1 hora
        
        // Verificar inmediatamente
        this.checkReminders();
    }
    
    checkReminders() {
        if (this.parametros.length === 0) return;
        
        const ultimaMedicion = this.parametros[this.parametros.length - 1];
        const diasSinMedir = Math.floor((Date.now() - new Date(ultimaMedicion.fecha).getTime()) / (1000 * 60 * 60 * 24));
        
        // Recordatorio de medición (cada 7 días)
        if (diasSinMedir >= 7 && 'Notification' in window && Notification.permission === 'granted') {
            const lastNotification = localStorage.getItem('lastMeasurementNotification');
            const today = new Date().toDateString();
            
            if (lastNotification !== today) {
                new Notification('CoralTrack - Hora de Medir', {
                    body: `Han pasado ${diasSinMedir} días desde tu última medición. ¡Es hora de revisar tus parámetros!`,
                    icon: 'icon-192.png',
                    tag: 'measurement-reminder'
                });
                localStorage.setItem('lastMeasurementNotification', today);
            }
        }
        
        // Recordatorio de cambio de agua (cada 14 días)
        if (diasSinMedir >= 14) {
            const lastWaterChange = localStorage.getItem('lastWaterChangeNotification');
            const today = new Date().toDateString();
            
            if (lastWaterChange !== today && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('CoralTrack - Cambio de Agua', {
                    body: 'Considera hacer un cambio de agua para mantener los parámetros estables.',
                    icon: 'icon-192.png',
                    tag: 'water-change-reminder'
                });
                localStorage.setItem('lastWaterChangeNotification', today);
            }
        }
    }
    
    agregarNotaParametro(parametro, label) {
        const nota = prompt(`Agregar nota para ${label}:`, `${label} - `);
        if (nota && nota.trim()) {
            const notasParametros = JSON.parse(localStorage.getItem('notasParametros')) || {};
            if (!notasParametros[parametro]) notasParametros[parametro] = [];
            
            notasParametros[parametro].push({
                fecha: new Date().toISOString(),
                nota: nota.trim(),
                valor: this.parametros[this.parametros.length - 1][parametro]
            });
            
            localStorage.setItem('notasParametros', JSON.stringify(notasParametros));
            this.mostrarConfirmacion(`Nota agregada para ${label}`);
        }
    }
    
    getResumenGeneral(ultimaMedicion) {
        const parametrosCriticos = [];
        const parametrosOptimos = [];
        
        const rangos = {
            densidad: { min: 1.024, max: 1.026, label: 'Densidad' },
            kh: { min: 8, max: 10, label: 'KH' },
            calcio: { min: 400, max: 450, label: 'Calcio' },
            magnesio: { min: 1300, max: 1400, label: 'Magnesio' },
            nitratos: { min: 0, max: 10, label: 'Nitratos' },
            fosfatos: { min: 0, max: 0.05, label: 'Fosfatos' },
            temperatura: { min: 24, max: 26, label: 'Temperatura' }
        };
        
        Object.keys(rangos).forEach(param => {
            const valor = ultimaMedicion[param];
            const rango = rangos[param];
            
            if (valor) {
                if (valor < rango.min * 0.9 || valor > rango.max * 1.1) {
                    parametrosCriticos.push({ param, valor, label: rango.label });
                } else if (valor >= rango.min && valor <= rango.max) {
                    parametrosOptimos.push({ param, valor, label: rango.label });
                }
            }
        });
        
        return { parametrosCriticos, parametrosOptimos };
    }
    
    createWidgetResumen(resumen, score) {
        const proximaAccion = this.getProximaAccion(resumen, score);
        
        return `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin-bottom: 15px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🌊 Estado General del Acuario</h3>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold;">${resumen.parametrosOptimos.length}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Óptimos</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: ${resumen.parametrosCriticos.length > 0 ? '#ffeb3b' : '#4caf50'};">${resumen.parametrosCriticos.length}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Críticos</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold;">${score.value}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Score</div>
                    </div>
                </div>
                
                ${resumen.parametrosCriticos.length > 0 ? `
                    <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">⚠️ Parámetros Críticos:</div>
                        ${resumen.parametrosCriticos.slice(0, 3).map(p => `<div style="font-size: 12px;">• ${p.label}: ${p.valor}</div>`).join('')}
                    </div>
                ` : ''}
                
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">🎯 Próxima Acción:</div>
                    <div style="font-size: 12px;">${proximaAccion}</div>
                </div>
            </div>
        `;
    }
    
    getProximaAccion(resumen, score) {
        if (resumen.parametrosCriticos.length > 0) {
            const critico = resumen.parametrosCriticos[0];
            if (critico.param === 'nitratos' && critico.valor > 15) {
                return 'Cambio de agua del 20-30% recomendado';
            }
            if (critico.param === 'fosfatos' && critico.valor > 0.1) {
                return 'Revisar sistema de filtración';
            }
            if (critico.param === 'kh' && critico.valor < 7) {
                return 'Dosificar buffer de alcalinidad';
            }
            return `Ajustar ${critico.label} - Valor actual: ${critico.valor}`;
        }
        
        const diasSinMedir = Math.floor((Date.now() - new Date(this.parametros[this.parametros.length - 1].fecha).getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasSinMedir >= 7) {
            return 'Realizar nueva medición de parámetros';
        }
        
        if (score.value >= 85) {
            return 'Mantener rutina actual - Todo excelente';
        }
        
        return 'Monitorear parámetros regularmente';
    }
    
    mostrarCalculadora(parametro, label, valorActual) {
        const calculadora = this.getCalculadoraDosificacion(parametro, valorActual);
        if (calculadora) {
            alert(`🧮 Calculadora ${label}\n\n${calculadora}`);
        } else {
            alert(`Calculadora no disponible para ${label}`);
        }
    }
    
    getCalculadoraDosificacion(parametro, valorActual) {
        const volumenAcuario = parseInt(localStorage.getItem('volumenAcuario')) || 200; // Litros por defecto
        
        switch(parametro) {
            case 'kh':
                if (valorActual < 8) {
                    const diferencia = 8 - valorActual;
                    const dosificacion = Math.round(diferencia * volumenAcuario * 0.5); // 0.5ml por litro por dKH
                    return `Para subir KH de ${valorActual} a 8:\n• Necesitas: ${dosificacion}ml de buffer KH\n• Agregar gradualmente en 2-3 dosis\n• Esperar 30min entre dosis`;
                }
                return `KH está en rango óptimo (${valorActual})`;
                
            case 'calcio':
                if (valorActual < 400) {
                    const diferencia = 400 - valorActual;
                    const dosificacion = Math.round(diferencia * volumenAcuario * 0.02); // 0.02ml por litro por ppm
                    return `Para subir Calcio de ${valorActual} a 400ppm:\n• Necesitas: ${dosificacion}ml de solución Ca\n• Dosificar lentamente\n• Verificar KH simultáneamente`;
                }
                return `Calcio está en rango óptimo (${valorActual}ppm)`;
                
            case 'nitratos':
                if (valorActual > 10) {
                    const exceso = valorActual - 5; // Objetivo 5ppm
                    const cambioAgua = Math.min(50, Math.round((exceso / valorActual) * 100));
                    return `Para reducir Nitratos de ${valorActual} a 5ppm:\n• Cambio de agua: ${cambioAgua}%\n• Volumen: ${Math.round(volumenAcuario * cambioAgua / 100)}L\n• Repetir si es necesario en 3-4 días`;
                }
                return `Nitratos en rango aceptable (${valorActual}ppm)`;
                
            default:
                return null;
        }
    }
    
    renderAvanzado() {
        this.renderCalculadoras();
        this.renderComparacionTemporal();
        this.renderAnalisisPredictivo();
        this.renderCorrelaciones();
        this.renderMetasLogros();
    }
    
    renderCalculadoras() {
        const container = document.getElementById('calculadoras');
        if (!container) return;
        
        container.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 10px 0;">💧 Calculadora de Cambio de Agua</h4>
                <div style="margin-bottom: 10px;">
                    <label>Volumen del acuario (L):</label>
                    <input type="number" id="volumen-acuario" value="${localStorage.getItem('volumenAcuario') || 200}" style="width: 80px; margin-left: 10px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <button onclick="app.calcularCambioAgua()" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Calcular Cambio Recomendado</button>
                <div id="resultado-cambio-agua" style="margin-top: 10px; font-size: 14px;"></div>
            </div>
        `;
    }
    
    renderComparacionTemporal() {
        const container = document.getElementById('comparacion-temporal');
        if (!container || this.parametros.length < 2) {
            if (container) container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Necesitas más datos para comparación temporal</div>';
            return;
        }
        
        const ahora = new Date();
        const mesActual = this.parametros.filter(p => {
            const fecha = new Date(p.fecha);
            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        });
        
        const mesAnterior = this.parametros.filter(p => {
            const fecha = new Date(p.fecha);
            const mesAnt = new Date(ahora.getFullYear(), ahora.getMonth() - 1);
            return fecha.getMonth() === mesAnt.getMonth() && fecha.getFullYear() === mesAnt.getFullYear();
        });
        
        const comparacion = this.compararMeses(mesActual, mesAnterior);
        
        container.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #2196F3;">${mesActual.length}</div>
                        <div style="font-size: 12px; color: #666;">Este mes</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #666;">${mesAnterior.length}</div>
                        <div style="font-size: 12px; color: #666;">Mes anterior</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: ${comparacion.mejora ? '#4CAF50' : '#FF9800'};">${comparacion.mejora ? '↑' : '↓'}</div>
                        <div style="font-size: 12px; color: #666;">${comparacion.mejora ? 'Mejorando' : 'Revisar'}</div>
                    </div>
                </div>
                <div style="font-size: 14px; color: #666;">${comparacion.resumen}</div>
            </div>
        `;
    }
    
    renderAnalisisPredictivo() {
        const container = document.getElementById('analisis-predictivo');
        if (!container || this.parametros.length < 5) {
            if (container) container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Necesitas al menos 5 mediciones para análisis predictivo</div>';
            return;
        }
        
        const predicciones = this.calcularPredicciones();
        const alertas = this.calcularAlertasPreventivas();
        const patrones = this.detectarPatrones();
        
        container.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0;">🔮 Predicciones (próximas 2 semanas)</h4>
                ${predicciones.map(pred => `
                    <div style="padding: 10px; margin-bottom: 8px; background: ${pred.alerta ? '#FFF3E0' : '#E8F5E8'}; border-radius: 6px; border-left: 4px solid ${pred.alerta ? '#FF9800' : '#4CAF50'};">
                        <div style="font-weight: 600; color: #333;">${pred.parametro}</div>
                        <div style="font-size: 14px; color: #666;">${pred.prediccion}</div>
                        ${pred.confianza ? `<div style="font-size: 12px; color: #999;">Confianza: ${pred.confianza}%</div>` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0;">⚠️ Alertas Preventivas</h4>
                ${alertas.length > 0 ? alertas.map(alerta => `
                    <div style="padding: 10px; margin-bottom: 8px; background: #FFEBEE; border-radius: 6px; border-left: 4px solid #f44336;">
                        <div style="font-weight: 600; color: #C62828;">${alerta.titulo}</div>
                        <div style="font-size: 14px; color: #666;">${alerta.mensaje}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">${alerta.accion}</div>
                    </div>
                `).join('') : '<div style="color: #4CAF50; text-align: center; padding: 10px;">✅ No hay alertas preventivas</div>'}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0;">📊 Patrones Detectados</h4>
                ${patrones.length > 0 ? patrones.map(patron => `
                    <div style="padding: 10px; margin-bottom: 8px; background: #E3F2FD; border-radius: 6px; border-left: 4px solid #2196F3;">
                        <div style="font-weight: 600; color: #1565C0;">${patron.tipo}</div>
                        <div style="font-size: 14px; color: #666;">${patron.descripcion}</div>
                    </div>
                `).join('') : '<div style="color: #666; text-align: center; padding: 10px;">No se detectaron patrones claros aún</div>'}
            </div>
        `;
    }
    
    calcularPredicciones() {
        const predicciones = [];
        const parametros = ['nitratos', 'fosfatos', 'kh', 'calcio'];
        
        parametros.forEach(param => {
            const datos = this.parametros.filter(p => p[param] !== null).slice(-10);
            if (datos.length >= 3) {
                const valores = datos.map(d => d[param]);
                const tendencia = this.calcularTendencia(valores);
                const valorActual = valores[valores.length - 1];
                const valorPredicto = valorActual + (tendencia * 14); // 14 días
                
                const rangos = {
                    nitratos: { min: 0, max: 10, unidad: 'ppm' },
                    fosfatos: { min: 0, max: 0.05, unidad: 'ppm' },
                    kh: { min: 8, max: 10, unidad: 'dKH' },
                    calcio: { min: 400, max: 450, unidad: 'ppm' }
                };
                
                const rango = rangos[param];
                const alerta = valorPredicto < rango.min || valorPredicto > rango.max;
                const confianza = Math.min(95, Math.max(60, 100 - (Math.abs(tendencia) * 20)));
                
                predicciones.push({
                    parametro: param.charAt(0).toUpperCase() + param.slice(1),
                    prediccion: `Valor estimado: ${valorPredicto.toFixed(2)} ${rango.unidad}`,
                    alerta,
                    confianza: Math.round(confianza)
                });
            }
        });
        
        return predicciones;
    }
    
    calcularAlertasPreventivas() {
        const alertas = [];
        const ahora = new Date();
        
        // Alerta de cambio de agua
        const ultimosCambios = this.parametros.filter(p => p.notas && p.notas.toLowerCase().includes('cambio'));
        if (ultimosCambios.length > 0) {
            const ultimoCambio = new Date(ultimosCambios[ultimosCambios.length - 1].fecha);
            const diasSinCambio = Math.floor((ahora - ultimoCambio) / (1000 * 60 * 60 * 24));
            
            if (diasSinCambio > 10) {
                alertas.push({
                    titulo: 'Cambio de Agua Recomendado',
                    mensaje: `Han pasado ${diasSinCambio} días desde tu último cambio de agua`,
                    accion: 'Considera hacer un cambio del 20-25%'
                });
            }
        }
        
        // Alerta de tendencia de nitratos
        const nitratos = this.parametros.filter(p => p.nitratos !== null).slice(-5);
        if (nitratos.length >= 3) {
            const valores = nitratos.map(n => n.nitratos);
            const tendencia = this.calcularTendencia(valores);
            
            if (tendencia > 0.5) {
                alertas.push({
                    titulo: 'Nitratos en Aumento',
                    mensaje: 'Tus nitratos han mostrado tendencia al alza',
                    accion: 'Revisa alimentación y considera cambio de agua'
                });
            }
        }
        
        return alertas;
    }
    
    detectarPatrones() {
        const patrones = [];
        
        // Patrón de estabilidad
        const ultimasMediciones = this.parametros.slice(-10);
        if (ultimasMediciones.length >= 5) {
            const estabilidad = this.calcularEstabilidad(ultimasMediciones);
            
            if (estabilidad > 0.8) {
                patrones.push({
                    tipo: 'Alta Estabilidad',
                    descripcion: 'Tus parámetros han sido muy estables en las últimas mediciones'
                });
            } else if (estabilidad < 0.4) {
                patrones.push({
                    tipo: 'Inestabilidad Detectada',
                    descripcion: 'Tus parámetros muestran variaciones significativas'
                });
            }
        }
        
        // Patrón de frecuencia de medición
        if (this.parametros.length >= 5) {
            const intervalos = [];
            for (let i = 1; i < this.parametros.length; i++) {
                const dias = Math.floor((new Date(this.parametros[i].fecha) - new Date(this.parametros[i-1].fecha)) / (1000 * 60 * 60 * 24));
                intervalos.push(dias);
            }
            
            const promedioIntervalo = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
            
            if (promedioIntervalo <= 7) {
                patrones.push({
                    tipo: 'Monitoreo Frecuente',
                    descripcion: `Mides tus parámetros cada ${Math.round(promedioIntervalo)} días en promedio`
                });
            }
        }
        
        return patrones;
    }
    
    calcularTendencia(valores) {
        if (valores.length < 2) return 0;
        
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = valores.length;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += valores[i];
            sumXY += i * valores[i];
            sumXX += i * i;
        }
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
    
    calcularEstabilidad(mediciones) {
        const parametros = ['kh', 'calcio', 'nitratos', 'fosfatos'];
        let estabilidadTotal = 0;
        let parametrosValidos = 0;
        
        parametros.forEach(param => {
            const valores = mediciones.filter(m => m[param] !== null).map(m => m[param]);
            if (valores.length >= 3) {
                const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
                const varianza = valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / valores.length;
                const coeficienteVariacion = Math.sqrt(varianza) / promedio;
                
                estabilidadTotal += Math.max(0, 1 - coeficienteVariacion);
                parametrosValidos++;
            }
        });
        
        return parametrosValidos > 0 ? estabilidadTotal / parametrosValidos : 0;
    }
    
    renderCorrelaciones() {
        const container = document.getElementById('correlaciones');
        if (!container || this.parametros.length < 8) {
            if (container) container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Necesitas al menos 8 mediciones para análisis de correlaciones</div>';
            return;
        }
        
        const causaEfecto = this.analizarCausaEfecto();
        const impactoCambios = this.analizarImpactoCambios();
        const correlacionFotos = this.analizarCorrelacionFotos();
        const efectividadAcciones = this.analizarEfectividadAcciones();
        
        container.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0;">🔗 Análisis Causa-Efecto</h4>
                ${causaEfecto.length > 0 ? causaEfecto.map(correlacion => `
                    <div style="padding: 10px; margin-bottom: 8px; background: ${correlacion.fuerza > 0.6 ? '#E8F5E8' : correlacion.fuerza > 0.3 ? '#FFF3E0' : '#F5F5F5'}; border-radius: 6px; border-left: 4px solid ${correlacion.fuerza > 0.6 ? '#4CAF50' : correlacion.fuerza > 0.3 ? '#FF9800' : '#999'};">
                        <div style="font-weight: 600; color: #333;">${correlacion.relacion}</div>
                        <div style="font-size: 14px; color: #666;">${correlacion.descripcion}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">Correlación: ${(correlacion.fuerza * 100).toFixed(0)}%</div>
                    </div>
                `).join('') : '<div style="color: #666; text-align: center; padding: 10px;">No se detectaron correlaciones significativas</div>'}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0;">💧 Impacto de Cambios de Agua</h4>
                ${impactoCambios.length > 0 ? impactoCambios.map(impacto => `
                    <div style="padding: 10px; margin-bottom: 8px; background: ${impacto.efectivo ? '#E8F5E8' : '#FFF3E0'}; border-radius: 6px; border-left: 4px solid ${impacto.efectivo ? '#4CAF50' : '#FF9800'};">
                        <div style="font-weight: 600; color: #333;">${impacto.parametro}</div>
                        <div style="font-size: 14px; color: #666;">${impacto.efecto}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">${impacto.fecha}</div>
                    </div>
                `).join('') : '<div style="color: #666; text-align: center; padding: 10px;">No hay suficientes cambios de agua registrados</div>'}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0;">📸 Correlación Fotos-Parámetros</h4>
                ${correlacionFotos.length > 0 ? correlacionFotos.map(corr => `
                    <div style="padding: 10px; margin-bottom: 8px; background: #E3F2FD; border-radius: 6px; border-left: 4px solid #2196F3;">
                        <div style="font-weight: 600; color: #1565C0;">${corr.insight}</div>
                        <div style="font-size: 14px; color: #666;">${corr.detalle}</div>
                    </div>
                `).join('') : '<div style="color: #666; text-align: center; padding: 10px;">Agrega más fotos para análisis de correlación</div>'}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0;">⚡ Efectividad de Acciones</h4>
                ${efectividadAcciones.length > 0 ? efectividadAcciones.map(accion => `
                    <div style="padding: 10px; margin-bottom: 8px; background: ${accion.efectividad > 70 ? '#E8F5E8' : accion.efectividad > 40 ? '#FFF3E0' : '#FFEBEE'}; border-radius: 6px; border-left: 4px solid ${accion.efectividad > 70 ? '#4CAF50' : accion.efectividad > 40 ? '#FF9800' : '#f44336'};">
                        <div style="font-weight: 600; color: #333;">${accion.accion}</div>
                        <div style="font-size: 14px; color: #666;">${accion.resultado}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">Efectividad: ${accion.efectividad}%</div>
                    </div>
                `).join('') : '<div style="color: #666; text-align: center; padding: 10px;">Registra más acciones en las notas para análisis</div>'}
            </div>
        `;
    }
    
    analizarCausaEfecto() {
        const correlaciones = [];
        const parametros = ['kh', 'calcio', 'nitratos', 'fosfatos', 'temperatura'];
        
        // Analizar correlaciones entre parámetros
        for (let i = 0; i < parametros.length; i++) {
            for (let j = i + 1; j < parametros.length; j++) {
                const param1 = parametros[i];
                const param2 = parametros[j];
                
                const datos1 = this.parametros.filter(p => p[param1] !== null).map(p => p[param1]);
                const datos2 = this.parametros.filter(p => p[param2] !== null).map(p => p[param2]);
                
                if (datos1.length >= 5 && datos2.length >= 5) {
                    const correlacion = this.calcularCorrelacion(datos1.slice(-10), datos2.slice(-10));
                    
                    if (Math.abs(correlacion) > 0.3) {
                        const relaciones = {
                            'kh-calcio': 'KH y Calcio están relacionados',
                            'nitratos-fosfatos': 'Nitratos y Fosfatos siguen patrones similares',
                            'kh-nitratos': correlacion > 0 ? 'Cuando KH sube, Nitratos tienden a subir' : 'Cuando KH baja, Nitratos tienden a subir',
                            'calcio-nitratos': correlacion > 0 ? 'Calcio alto coincide con Nitratos altos' : 'Calcio alto coincide con Nitratos bajos'
                        };
                        
                        const key = `${param1}-${param2}`;
                        if (relaciones[key]) {
                            correlaciones.push({
                                relacion: relaciones[key],
                                descripcion: correlacion > 0 ? 'Correlación positiva detectada' : 'Correlación negativa detectada',
                                fuerza: Math.abs(correlacion)
                            });
                        }
                    }
                }
            }
        }
        
        return correlaciones;
    }
    
    analizarImpactoCambios() {
        const impactos = [];
        const cambiosAgua = this.parametros.filter(p => 
            p.notas && p.notas.toLowerCase().includes('cambio')
        );
        
        cambiosAgua.forEach(cambio => {
            const fechaCambio = new Date(cambio.fecha);
            const parametroAntes = this.parametros.find(p => {
                const fecha = new Date(p.fecha);
                return fecha < fechaCambio && (fechaCambio - fecha) <= 7 * 24 * 60 * 60 * 1000;
            });
            
            const parametroDespues = this.parametros.find(p => {
                const fecha = new Date(p.fecha);
                return fecha > fechaCambio && (fecha - fechaCambio) <= 7 * 24 * 60 * 60 * 1000;
            });
            
            if (parametroAntes && parametroDespues) {
                ['nitratos', 'fosfatos', 'kh'].forEach(param => {
                    if (parametroAntes[param] && parametroDespues[param]) {
                        const cambioValor = parametroDespues[param] - parametroAntes[param];
                        const porcentajeCambio = (cambioValor / parametroAntes[param]) * 100;
                        
                        if (Math.abs(porcentajeCambio) > 10) {
                            impactos.push({
                                parametro: param.charAt(0).toUpperCase() + param.slice(1),
                                efecto: `${cambioValor > 0 ? 'Subió' : 'Bajó'} ${Math.abs(porcentajeCambio).toFixed(1)}%`,
                                efectivo: (param === 'nitratos' || param === 'fosfatos') ? cambioValor < 0 : Math.abs(cambioValor) < parametroAntes[param] * 0.1,
                                fecha: cambio.fecha.split('-').reverse().join('/')
                            });
                        }
                    }
                });
            }
        });
        
        return impactos.slice(-5); // Últimos 5 cambios
    }
    
    analizarCorrelacionFotos() {
        const correlaciones = [];
        const totalFotos = Object.values(this.fotos).reduce((sum, especies) => sum + especies.length, 0);
        
        if (totalFotos < 5) return correlaciones;
        
        // Analizar períodos con más/menos fotos vs parámetros
        const ultimosMeses = this.parametros.filter(p => {
            const fecha = new Date(p.fecha);
            const hace3Meses = new Date();
            hace3Meses.setMonth(hace3Meses.getMonth() - 3);
            return fecha >= hace3Meses;
        });
        
        if (ultimosMeses.length >= 5) {
            const promedioNitratos = ultimosMeses.reduce((sum, p) => sum + (p.nitratos || 0), 0) / ultimosMeses.length;
            const promedioKH = ultimosMeses.reduce((sum, p) => sum + (p.kh || 0), 0) / ultimosMeses.length;
            
            if (promedioNitratos < 8) {
                correlaciones.push({
                    insight: 'Condiciones óptimas para fotografía',
                    detalle: `Con nitratos promedio de ${promedioNitratos.toFixed(1)}ppm, tus corales se ven saludables en las fotos`
                });
            }
            
            if (promedioKH >= 8 && promedioKH <= 10) {
                correlaciones.push({
                    insight: 'KH estable = corales fotogénicos',
                    detalle: `Tu KH estable (${promedioKH.toFixed(1)}) coincide con el período de más fotos`
                });
            }
        }
        
        return correlaciones;
    }
    
    analizarEfectividadAcciones() {
        const acciones = [];
        const accionesComunes = [
            { keyword: 'cambio', nombre: 'Cambios de agua' },
            { keyword: 'dosif', nombre: 'Dosificación' },
            { keyword: 'limpi', nombre: 'Limpieza' },
            { keyword: 'aliment', nombre: 'Ajuste alimentación' }
        ];
        
        accionesComunes.forEach(accion => {
            const registros = this.parametros.filter(p => 
                p.notas && p.notas.toLowerCase().includes(accion.keyword)
            );
            
            if (registros.length >= 2) {
                let mejoras = 0;
                let total = 0;
                
                registros.forEach(registro => {
                    const fechaAccion = new Date(registro.fecha);
                    const despues = this.parametros.find(p => {
                        const fecha = new Date(p.fecha);
                        return fecha > fechaAccion && (fecha - fechaAccion) <= 10 * 24 * 60 * 60 * 1000;
                    });
                    
                    if (despues) {
                        total++;
                        // Evaluar si hubo mejora en parámetros críticos
                        if ((registro.nitratos && despues.nitratos && despues.nitratos < registro.nitratos) ||
                            (registro.fosfatos && despues.fosfatos && despues.fosfatos < registro.fosfatos) ||
                            (registro.kh && despues.kh && Math.abs(despues.kh - 8.5) < Math.abs(registro.kh - 8.5))) {
                            mejoras++;
                        }
                    }
                });
                
                if (total > 0) {
                    const efectividad = Math.round((mejoras / total) * 100);
                    acciones.push({
                        accion: accion.nombre,
                        resultado: `${mejoras} de ${total} veces mejoraron los parámetros`,
                        efectividad
                    });
                }
            }
        });
        
        return acciones;
    }
    
    calcularCorrelacion(x, y) {
        const n = Math.min(x.length, y.length);
        if (n < 3) return 0;
        
        const xSlice = x.slice(0, n);
        const ySlice = y.slice(0, n);
        
        const sumX = xSlice.reduce((a, b) => a + b, 0);
        const sumY = ySlice.reduce((a, b) => a + b, 0);
        const sumXY = xSlice.reduce((sum, xi, i) => sum + xi * ySlice[i], 0);
        const sumXX = xSlice.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = ySlice.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    setupBioTabs() {
        document.querySelectorAll('.bio-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.bio-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.bio-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.bio).classList.add('active');
                
                // Renderizar contenido específico
                if (e.target.dataset.bio === 'mapa') {
                    this.renderMapaTanque();
                } else if (e.target.dataset.bio === 'crecimiento') {
                    this.renderAnalisisCrecimiento();
                }
            });
        });
    }
    
    renderBiologico() {
        this.renderInventario();
        this.renderEventos();
    }
    
    renderInventario() {
        const container = document.getElementById('lista-inventario');
        if (!container) return;
        
        if (this.inventario.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">🐠 No hay corales en el inventario<br><small>Agrega tu primer coral para comenzar</small></div>';
            return;
        }
        
        container.innerHTML = this.inventario.map((coral, index) => {
            const estadoColors = {
                excelente: '#4CAF50',
                bueno: '#8BC34A', 
                regular: '#FF9800',
                malo: '#f44336'
            };
            
            const estadoIcons = {
                excelente: '🟢',
                bueno: '🟡',
                regular: '🟠', 
                malo: '🔴'
            };
            
            return `
                <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid ${estadoColors[coral.estado]};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #333;">${coral.nombre}</h4>
                            <div style="font-size: 14px; color: #666;">Agregado: ${coral.fecha.split('-').reverse().join('/')}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 18px; margin-bottom: 5px;">${estadoIcons[coral.estado]}</div>
                            <div style="font-size: 12px; color: ${estadoColors[coral.estado]}; font-weight: 600; text-transform: uppercase;">${coral.estado}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <div style="font-size: 14px; color: #666;">
                            💰 Costo: $${coral.costo || 0}
                        </div>
                        <div style="font-size: 14px; color: #666;">
                            🗺️ Posición: ${coral.x || 0}%, ${coral.y || 0}%
                        </div>
                    </div>
                    
                    ${coral.notas ? `<div style="font-size: 14px; color: #777; font-style: italic; margin-bottom: 10px;">${coral.notas}</div>` : ''}
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="app.editarCoral(${index})" style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">✏️ Editar</button>
                        <button onclick="app.verHistorialCoral(${index})" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">📈 Historial</button>
                        <button onclick="app.eliminarCoral(${index})" style="flex: 1; padding: 8px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderEventos() {
        const container = document.getElementById('lista-eventos');
        if (!container) return;
        
        if (this.eventos.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">📅 No hay eventos registrados<br><small>Registra eventos importantes de tus corales</small></div>';
            return;
        }
        
        const eventosOrdenados = [...this.eventos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        container.innerHTML = eventosOrdenados.map((evento, index) => {
            const tipoColors = {
                adquisicion: '#4CAF50',
                muerte: '#f44336',
                enfermedad: '#FF9800',
                reproduccion: '#9C27B0',
                cambio: '#2196F3',
                otro: '#607D8B'
            };
            
            const tipoIcons = {
                adquisicion: '🛒',
                muerte: '💀',
                enfermedad: '🦠',
                reproduccion: '🐣',
                cambio: '🔄',
                otro: '📝'
            };
            
            return `
                <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid ${tipoColors[evento.tipo]};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">${tipoIcons[evento.tipo]}</span>
                            <div>
                                <div style="font-weight: 600; color: #333; text-transform: capitalize;">${evento.tipo.replace('_', ' ')}</div>
                                <div style="font-size: 14px; color: #666;">${evento.fecha.split('-').reverse().join('/')}</div>
                            </div>
                        </div>
                        <button onclick="app.eliminarEvento(${this.eventos.indexOf(evento)})" style="width: 24px; height: 24px; background: #f44336; color: white; border: none; border-radius: 50%; font-size: 12px; cursor: pointer;">×</button>
                    </div>
                    
                    ${evento.coral ? `<div style="font-size: 14px; color: #666; margin-bottom: 8px;">🐠 Coral: ${evento.coral}</div>` : ''}
                    
                    <div style="font-size: 14px; color: #333;">${evento.descripcion}</div>
                </div>
            `;
        }).join('');
    }
    
    renderMapaTanque() {
        const container = document.getElementById('mapa-tanque');
        if (!container) return;
        
        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; text-align: center;">🗺️ Mapa del Tanque</h4>
                <div id="tanque-visual" style="position: relative; width: 100%; height: 300px; background: linear-gradient(180deg, #87CEEB 0%, #4682B4 100%); border-radius: 8px; border: 3px solid #2F4F4F; overflow: hidden;">
                    ${this.inventario.map((coral, index) => `
                        <div onclick="app.mostrarInfoCoral(${index})" style="
                            position: absolute;
                            left: ${coral.x || 50}%;
                            top: ${coral.y || 50}%;
                            width: 20px;
                            height: 20px;
                            background: ${this.getCoralColor(coral.estado)};
                            border-radius: 50%;
                            border: 2px solid white;
                            cursor: pointer;
                            transform: translate(-50%, -50%);
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='translate(-50%, -50%) scale(1.2)'" onmouseout="this.style.transform='translate(-50%, -50%) scale(1)'" title="${coral.nombre}">
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                    Haz clic en los puntos para ver detalles del coral
                </div>
            </div>
        `;
    }
    
    renderAnalisisCrecimiento() {
        const container = document.getElementById('analisis-crecimiento');
        if (!container) return;
        
        const analisis = this.calcularCrecimiento();
        
        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0;">📏 Análisis de Crecimiento</h4>
                ${analisis.length > 0 ? analisis.map(item => `
                    <div style="padding: 15px; margin-bottom: 10px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #4CAF50;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 8px;">${item.especie}</div>
                        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">📸 Fotos analizadas: ${item.totalFotos}</div>
                        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">📅 Período: ${item.periodo}</div>
                        <div style="font-size: 14px; color: #4CAF50; font-weight: 500;">${item.crecimiento}</div>
                    </div>
                `).join('') : '<div style="text-align: center; padding: 40px; color: #666;">📏 No hay suficientes fotos para análisis<br><small>Agrega más fotos con el tiempo para ver el crecimiento</small></div>'}
            </div>
        `;
    }
    
    agregarCoral() {
        document.getElementById('coral-modal').style.display = 'flex';
        document.getElementById('coral-nombre').focus();
    }
    
    guardarCoral() {
        const nombre = document.getElementById('coral-nombre').value.trim();
        const costo = parseFloat(document.getElementById('coral-costo').value) || 0;
        const estado = document.getElementById('coral-estado').value;
        const x = parseInt(document.getElementById('coral-x').value) || 50;
        const y = parseInt(document.getElementById('coral-y').value) || 50;
        const notas = document.getElementById('coral-notas').value.trim();
        
        if (!nombre) {
            alert('Por favor ingresa el nombre del coral');
            return;
        }
        
        const coral = {
            id: Date.now(),
            nombre,
            costo,
            estado,
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            notas,
            fecha: new Date().toISOString().split('T')[0]
        };
        
        this.inventario.push(coral);
        localStorage.setItem('inventario', JSON.stringify(this.inventario));
        
        this.cancelarCoral();
        this.renderInventario();
        this.mostrarConfirmacion('🐠 Coral agregado al inventario');
    }
    
    cancelarCoral() {
        document.getElementById('coral-modal').style.display = 'none';
        document.getElementById('coral-nombre').value = '';
        document.getElementById('coral-costo').value = '';
        document.getElementById('coral-estado').value = 'excelente';
        document.getElementById('coral-x').value = '';
        document.getElementById('coral-y').value = '';
        document.getElementById('coral-notas').value = '';
    }
    
    agregarEvento() {
        // Llenar select de corales
        const select = document.getElementById('evento-coral');
        select.innerHTML = '<option value="">Seleccionar coral...</option>' + 
            this.inventario.map(coral => `<option value="${coral.nombre}">${coral.nombre}</option>`).join('');
        
        document.getElementById('evento-modal').style.display = 'flex';
    }
    
    guardarEvento() {
        const tipo = document.getElementById('evento-tipo').value;
        const coral = document.getElementById('evento-coral').value;
        const descripcion = document.getElementById('evento-descripcion').value.trim();
        
        if (!descripcion) {
            alert('Por favor ingresa una descripción del evento');
            return;
        }
        
        const evento = {
            id: Date.now(),
            tipo,
            coral,
            descripcion,
            fecha: new Date().toISOString().split('T')[0]
        };
        
        this.eventos.push(evento);
        localStorage.setItem('eventos', JSON.stringify(this.eventos));
        
        this.cancelarEvento();
        this.renderEventos();
        this.mostrarConfirmacion('📅 Evento registrado');
    }
    
    cancelarEvento() {
        document.getElementById('evento-modal').style.display = 'none';
        document.getElementById('evento-tipo').value = 'adquisicion';
        document.getElementById('evento-coral').value = '';
        document.getElementById('evento-descripcion').value = '';
    }
    
    eliminarCoral(index) {
        if (confirm('¿Eliminar este coral del inventario?')) {
            this.inventario.splice(index, 1);
            localStorage.setItem('inventario', JSON.stringify(this.inventario));
            this.renderInventario();
            this.mostrarConfirmacion('🗑️ Coral eliminado');
        }
    }
    
    eliminarEvento(index) {
        if (confirm('¿Eliminar este evento?')) {
            this.eventos.splice(index, 1);
            localStorage.setItem('eventos', JSON.stringify(this.eventos));
            this.renderEventos();
            this.mostrarConfirmacion('🗑️ Evento eliminado');
        }
    }
    
    getCoralColor(estado) {
        const colors = {
            excelente: '#4CAF50',
            bueno: '#8BC34A',
            regular: '#FF9800', 
            malo: '#f44336'
        };
        return colors[estado] || '#999';
    }
    
    mostrarInfoCoral(index) {
        const coral = this.inventario[index];
        alert(`🐠 ${coral.nombre}\n🟢 Estado: ${coral.estado}\n💰 Costo: $${coral.costo}\n📅 Agregado: ${coral.fecha.split('-').reverse().join('/')}${coral.notas ? `\n📝 ${coral.notas}` : ''}`);
    }
    
    calcularCrecimiento() {
        const analisis = [];
        
        Object.keys(this.fotos).forEach(especie => {
            const fotos = this.fotos[especie];
            if (fotos.length >= 3) {
                const fotosOrdenadas = fotos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                const primera = fotosOrdenadas[0];
                const ultima = fotosOrdenadas[fotosOrdenadas.length - 1];
                
                const diasTranscurridos = Math.floor((new Date(ultima.fecha) - new Date(primera.fecha)) / (1000 * 60 * 60 * 24));
                const mesesTranscurridos = diasTranscurridos / 30;
                
                let crecimiento = 'Crecimiento moderado detectado';
                if (fotos.length >= 10) {
                    crecimiento = 'Crecimiento acelerado - muchas fotos registradas';
                } else if (mesesTranscurridos > 3) {
                    crecimiento = 'Crecimiento lento pero constante';
                }
                
                analisis.push({
                    especie: especie.charAt(0).toUpperCase() + especie.slice(1),
                    totalFotos: fotos.length,
                    periodo: `${Math.round(mesesTranscurridos)} meses`,
                    crecimiento
                });
            }
        });
        
        return analisis;
    }
    
    renderMetasLogros() {
        const container = document.getElementById('metas-logros');
        if (!container) return;
        
        const logros = this.calcularLogros();
        const metas = this.getMetas();
        
        container.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0;">🏆 Logros Desbloqueados</h4>
                ${logros.map(logro => `
                    <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 8px; background: ${logro.desbloqueado ? '#E8F5E8' : '#f5f5f5'}; border-radius: 6px;">
                        <span style="font-size: 20px; margin-right: 10px;">${logro.desbloqueado ? logro.icono : '⬜'}</span>
                        <div>
                            <div style="font-weight: 600; color: ${logro.desbloqueado ? '#4CAF50' : '#999'};">${logro.titulo}</div>
                            <div style="font-size: 12px; color: #666;">${logro.descripcion}</div>
                        </div>
                    </div>
                `).join('')}
                
                <h4 style="margin: 20px 0 10px 0;">🎯 Puntuación Total</h4>
                <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold;">${logros.reduce((sum, l) => sum + (l.desbloqueado ? l.puntos : 0), 0)}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Puntos de Consistencia</div>
                </div>
            </div>
        `;
    }
    
    calcularCambioAgua() {
        const volumen = parseInt(document.getElementById('volumen-acuario').value) || 200;
        localStorage.setItem('volumenAcuario', volumen);
        
        if (this.parametros.length === 0) {
            document.getElementById('resultado-cambio-agua').innerHTML = 'No hay datos para calcular';
            return;
        }
        
        const ultimo = this.parametros[this.parametros.length - 1];
        let porcentajeRecomendado = 15; // Base
        let razon = 'Mantenimiento regular';
        
        if (ultimo.nitratos > 15) {
            porcentajeRecomendado = 30;
            razon = 'Nitratos elevados';
        } else if (ultimo.fosfatos > 0.08) {
            porcentajeRecomendado = 25;
            razon = 'Fosfatos elevados';
        } else if (ultimo.nitratos > 10) {
            porcentajeRecomendado = 20;
            razon = 'Nitratos moderados';
        }
        
        const litros = Math.round(volumen * porcentajeRecomendado / 100);
        
        document.getElementById('resultado-cambio-agua').innerHTML = `
            <div style="background: #E3F2FD; padding: 10px; border-radius: 4px; border-left: 4px solid #2196F3;">
                <strong>Recomendación: ${porcentajeRecomendado}% (${litros}L)</strong><br>
                <small>Razón: ${razon}</small>
            </div>
        `;
    }
    
    compararMeses(mesActual, mesAnterior) {
        if (mesActual.length === 0 || mesAnterior.length === 0) {
            return { mejora: true, resumen: 'Datos insuficientes para comparar' };
        }
        
        const promedioActual = mesActual.reduce((sum, p) => sum + (p.nitratos || 0), 0) / mesActual.length;
        const promedioAnterior = mesAnterior.reduce((sum, p) => sum + (p.nitratos || 0), 0) / mesAnterior.length;
        
        const mejora = promedioActual < promedioAnterior;
        const diferencia = Math.abs(promedioActual - promedioAnterior).toFixed(1);
        
        return {
            mejora,
            resumen: `Nitratos promedio: ${mejora ? 'Reducción' : 'Aumento'} de ${diferencia}ppm vs mes anterior`
        };
    }
    
    calcularLogros() {
        const logros = [
            {
                id: 'primera_medicion',
                titulo: 'Primer Paso',
                descripcion: 'Realiza tu primera medición',
                icono: '🌟',
                puntos: 10,
                desbloqueado: this.parametros.length > 0
            },
            {
                id: 'semana_estable',
                titulo: 'Semana Estable',
                descripcion: '7 días con parámetros óptimos',
                icono: '🏆',
                puntos: 50,
                desbloqueado: this.verificarEstabilidad(7)
            },
            {
                id: 'mes_consistente',
                titulo: 'Mes Consistente',
                descripcion: '30 días de mediciones regulares',
                icono: '🏅',
                puntos: 100,
                desbloqueado: this.verificarConsistencia(30)
            },
            {
                id: 'maestro_acuarista',
                titulo: 'Maestro Acuarista',
                descripcion: '50 mediciones completadas',
                icono: '🥇',
                puntos: 200,
                desbloqueado: this.parametros.length >= 50
            }
        ];
        
        return logros;
    }
    
    getMetas() {
        return JSON.parse(localStorage.getItem('metas')) || [];
    }
    
    repararEspecies() {
        console.log('Reparando especies...');
        console.log('Especies en datos:', Object.keys(this.fotos));
        
        // Recrear todas las pestañas
        Object.keys(this.fotos).forEach(especieId => {
            if (especieId !== 'pachyclavularia' && especieId !== 'palythoa') {
                const nombreEspecie = especieId.charAt(0).toUpperCase() + especieId.slice(1).replace(/-/g, ' ');
                
                // Verificar si la pestaña existe
                if (!document.querySelector(`[data-coral="${especieId}"]`)) {
                    console.log('Recreando pestaña para:', especieId);
                    this.crearTabEspecie(especieId, nombreEspecie);
                    this.crearContenidoEspecie(especieId, nombreEspecie);
                }
            }
        });
        
        this.renderFotos();
        this.mostrarConfirmacion('✅ Especies reparadas');
    }
    
    expandirGrafico(param, label, color) {
        const modal = document.createElement('div');
        modal.id = 'chart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 20px;
            width: 100%;
            max-width: 100%;
            height: 80vh;
            position: relative;
        `;
        
        const parametrosConFecha = this.parametros.filter(p => p[param] !== null && p[param] !== undefined);
        const valores = parametrosConFecha.map(p => p[param]);
        const fechas = parametrosConFecha.map(p => p.fecha.split('-').reverse().join('/'));
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #333; font-size: 1.5rem;">${label}</h3>
                <button onclick="document.getElementById('chart-modal').remove()" style="width: 40px; height: 40px; border: none; background: #f44336; color: white; border-radius: 50%; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div style="height: calc(100% - 80px); position: relative;">
                <canvas id="expanded-chart-${param}"></canvas>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Crear gráfico expandido
        setTimeout(() => {
            const canvas = document.getElementById(`expanded-chart-${param}`);
            if (canvas && valores.length >= 2) {
                const ctx = canvas.getContext('2d');
                
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: fechas,
                        datasets: [{
                            label: label,
                            data: valores,
                            borderColor: color,
                            backgroundColor: color + '15',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 8,
                            pointBackgroundColor: color,
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                cornerRadius: 8,
                                padding: 12,
                                titleFont: { size: 14 },
                                bodyFont: { size: 12 }
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: '#f0f0f0' },
                                ticks: { color: '#666', font: { size: 12 } }
                            },
                            y: {
                                grid: { color: '#f0f0f0' },
                                ticks: { color: '#666', font: { size: 12 } },
                                beginAtZero: false
                            }
                        }
                    }
                });
            }
        }, 100);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Cerrar con tecla ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }
    
    verificarEstabilidad(dias) {
        if (this.parametros.length < dias) return false;
        
        const ultimos = this.parametros.slice(-dias);
        return ultimos.every(p => {
            return (p.kh >= 8 && p.kh <= 10) && 
                   (p.calcio >= 400 && p.calcio <= 450) && 
                   (p.nitratos <= 10);
        });
    }
    
    verificarConsistencia(dias) {
        if (this.parametros.length < dias / 7) return false; // Al menos 1 medición por semana
        
        const fechas = this.parametros.map(p => new Date(p.fecha));
        const hoy = new Date();
        const hace30Dias = new Date(hoy.getTime() - dias * 24 * 60 * 60 * 1000);
        
        const medicionesRecientes = fechas.filter(f => f >= hace30Dias);
        return medicionesRecientes.length >= dias / 7;
    }
    
    exportarDatos() {
        const datos = {
            parametros: this.parametros,
            fotos: this.fotos,
            notasParametros: JSON.parse(localStorage.getItem('notasParametros')) || {},
            volumenAcuario: localStorage.getItem('volumenAcuario') || 200,
            fechaExport: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coraltrack-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.mostrarConfirmacion('Datos exportados exitosamente');
    }
    
    importarDatos(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const datos = JSON.parse(e.target.result);
                
                if (datos.parametros && Array.isArray(datos.parametros)) {
                    if (confirm('¿Importar datos? Esto reemplazará todos los datos actuales.')) {
                        this.parametros = datos.parametros;
                        this.fotos = datos.fotos || { pachyclavularia: [], palythoa: [] };
                        
                        localStorage.setItem('parametros', JSON.stringify(this.parametros));
                        localStorage.setItem('fotos', JSON.stringify(this.fotos));
                        
                        if (datos.notasParametros) {
                            localStorage.setItem('notasParametros', JSON.stringify(datos.notasParametros));
                        }
                        
                        if (datos.volumenAcuario) {
                            localStorage.setItem('volumenAcuario', datos.volumenAcuario);
                        }
                        
                        this.debouncedRender();
                        this.renderFotos();
                        this.renderAvanzado();
                        this.mostrarConfirmacion('Datos importados exitosamente');
                    }
                } else {
                    alert('Archivo inválido. Selecciona un backup de CoralTrack.');
                }
            } catch (error) {
                alert('Error al leer el archivo. Verifica que sea un backup válido.');
            }
        };
        reader.readAsText(file);
    }
    
    eliminarMedicion(index) {
        if (confirm('¿Eliminar esta medición?')) {
            this.parametros.splice(index, 1);
            localStorage.setItem('parametros', JSON.stringify(this.parametros));
            this.debouncedRender();
            this.mostrarConfirmacion('🗑️ Medición eliminada');
        }
    }
    
    editarMedicion(index) {
        const medicion = this.parametros[index];
        
        // Cargar datos en el formulario
        document.getElementById('fecha').value = medicion.fecha;
        document.getElementById('densidad').value = medicion.densidad || '';
        document.getElementById('kh').value = medicion.kh || '';
        document.getElementById('calcio').value = medicion.calcio || '';
        document.getElementById('magnesio').value = medicion.magnesio || '';
        document.getElementById('nitratos').value = medicion.nitratos || '';
        document.getElementById('fosfatos').value = medicion.fosfatos || '';
        document.getElementById('temperatura').value = medicion.temperatura || '';
        document.getElementById('notas').value = medicion.notas || '';
        
        // Eliminar la medición original
        this.parametros.splice(index, 1);
        localStorage.setItem('parametros', JSON.stringify(this.parametros));
        
        // Ir al paso 2 del formulario
        this.nextStep();
        
        // Scroll al formulario
        document.querySelector('.form-wizard').scrollIntoView({ behavior: 'smooth' });
        
        this.mostrarConfirmacion('✏️ Editando medición - Modifica y guarda');
    }
    
    toggleAccordion(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');
        
        header.classList.toggle('active');
        content.classList.toggle('active');
        
        if (content.classList.contains('active')) {
            icon.textContent = '▲';
        } else {
            icon.textContent = '▼';
        }
    }
    
    nextStep() {
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
        document.querySelector('[data-step="1"]').classList.remove('active');
        document.querySelector('[data-step="2"]').classList.add('active');
    }
    
    prevStep() {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
        document.querySelector('[data-step="2"]').classList.remove('active');
        document.querySelector('[data-step="1"]').classList.add('active');
    }
    
    guardarSoloBasicos() {
        const formData = new FormData(document.getElementById('parametros-form'));
        const parametro = { fecha: formData.get('fecha') };
        
        // Solo guardar campos básicos
        ['kh', 'nitratos', 'temperatura'].forEach(field => {
            const value = formData.get(field);
            parametro[field] = value ? parseFloat(value) : null;
        });
        
        this.parametros.push(parametro);
        localStorage.setItem('parametros', JSON.stringify(this.parametros));
        
        this.debouncedRender();
        this.mostrarConfirmacion('✅ Parámetros básicos guardados');
        
        // Reset form
        document.getElementById('parametros-form').reset();
        this.setFechaActual();
        this.prevStep();
    }
    
    checkOnboarding() {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        const hasData = this.parametros.length > 0;
        
        // Tour deshabilitado
        // if (!hasSeenOnboarding && !hasData) {
        //     setTimeout(() => {
        //         this.showOnboarding();
        //     }, 1000);
        // }
    }
    
    showOnboarding() {
        const onboardingSteps = [
            {
                title: '👋 ¡Bienvenido a CoralTrack!',
                content: 'Tu asistente personal para mantener un acuario de arrecife saludable.',
                action: 'Comenzar Tour'
            },
            {
                title: '📊 ¿Primera vez?',
                content: 'Te recomendamos cargar datos de ejemplo para ver cómo funciona la app.',
                action: 'Ver Datos Ejemplo',
                callback: () => {
                    this.cargarDatosEjemplo();
                    this.debouncedRender();
                }
            },
            {
                title: '📝 Agregar Mediciones',
                content: 'Usa el formulario simplificado. Solo necesitas 3 parámetros básicos para empezar.',
                action: 'Entendido'
            },
            {
                title: '🧮 Calculadoras',
                content: 'Los botones azules 🧮 te ayudan a calcular cuánto producto agregar.',
                action: 'Perfecto'
            },
            {
                title: '🏆 ¡Listo!',
                content: 'Ya puedes empezar a monitorear tu acuario. ¡Los corales te lo agradecerán!',
                action: 'Empezar'
            }
        ];
        
        this.currentOnboardingStep = 0;
        this.onboardingSteps = onboardingSteps;
        this.showOnboardingStep();
    }
    
    showOnboardingStep() {
        const step = this.onboardingSteps[this.currentOnboardingStep];
        
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-content">
                <div class="onboarding-header">
                    <h3>${step.title}</h3>
                    <div class="onboarding-progress">
                        <div class="progress-bar" style="width: ${((this.currentOnboardingStep + 1) / this.onboardingSteps.length) * 100}%"></div>
                    </div>
                </div>
                <div class="onboarding-body">
                    <p>${step.content}</p>
                </div>
                <div class="onboarding-footer">
                    ${this.currentOnboardingStep > 0 ? '<button class="btn-secondary" onclick="app.prevOnboardingStep()">Atrás</button>' : ''}
                    <button class="btn-primary" onclick="app.nextOnboardingStep()">${step.action}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
    
    nextOnboardingStep() {
        const currentStep = this.onboardingSteps[this.currentOnboardingStep];
        
        // Ejecutar callback si existe
        if (currentStep.callback) {
            currentStep.callback();
        }
        
        // Remover modal actual
        const modal = document.querySelector('.onboarding-modal');
        if (modal) {
            modal.remove();
        }
        
        this.currentOnboardingStep++;
        
        if (this.currentOnboardingStep < this.onboardingSteps.length) {
            setTimeout(() => {
                this.showOnboardingStep();
            }, 500);
        } else {
            // Onboarding completado
            localStorage.setItem('hasSeenOnboarding', 'true');
            this.mostrarConfirmacion('🎉 ¡Bienvenido a CoralTrack!');
        }
    }
    
    prevOnboardingStep() {
        const modal = document.querySelector('.onboarding-modal');
        if (modal) {
            modal.remove();
        }
        
        this.currentOnboardingStep--;
        
        if (this.currentOnboardingStep >= 0) {
            setTimeout(() => {
                this.showOnboardingStep();
            }, 300);
        }
    }
    

}



const app = new CoralTrack();

// Función global para toggle de gráficos
app.toggleChart = function(param) {
    const chartDiv = document.querySelector(`[data-param="${param}"]`);
    const content = chartDiv.querySelector('.chart-content');
    const icon = chartDiv.querySelector('.toggle-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
};