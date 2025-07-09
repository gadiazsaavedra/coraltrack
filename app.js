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
        this.renderDashboard();
        this.renderCharts();
        this.renderHistorial();
        this.renderFotos();
        this.renderAvanzado();
        this.checkAlerts();
        this.setupReminders();
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
                this.renderDashboard();
                this.renderCharts();
                this.renderHistorial();
                this.mostrarConfirmacion('Datos limpiados exitosamente');
            }
        });
        
        document.getElementById('datos-ejemplo').addEventListener('click', () => {
            console.log('Botón clickeado');
            this.cargarDatosEjemplo();
            console.log('Datos cargados:', this.parametros.length);
            this.renderDashboard();
            this.renderCharts();
            this.renderHistorial();
            this.checkAlerts();
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
        
        this.renderDashboard();
        this.renderCharts();
        this.renderHistorial();
        this.checkAlerts();
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
            chartsContainer.innerHTML = '<div class="no-data">📊 Toca "Ver Datos Ejemplo" arriba para ver los gráficos</div>';
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
                
                const miniChart = this.createMiniChart(valores, config.color);
                const rangeBar = this.createRangeBar(param, ultimo);
                
                html += `
                    <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 5px solid ${config.color}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; width: 100%; min-height: 120px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0; font-size: 16px; color: #333;">${config.label}</h3>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button onclick="app.mostrarCalculadora('${param}', '${config.label}', ${ultimo})" style="width: 24px; height: 24px; border-radius: 50%; background: #2196F3; color: white; border: none; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🧮</button>
                                <button onclick="app.agregarNotaParametro('${param}', '${config.label}')" style="width: 24px; height: 24px; border-radius: 50%; background: ${config.color}; color: white; border: none; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                                <span style="font-size: 18px;">${tendencia}</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: ${estado.color}; margin-bottom: 5px;">${ultimo}</div>
                                <div style="font-size: 11px; padding: 3px 6px; border-radius: 10px; background: ${estado.bg}; color: ${estado.color};">${estado.text}</div>
                            </div>
                            <div style="text-align: right;">
                                ${miniChart}
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">${valores.length} mediciones</div>
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
    
    createMiniChart(valores, color) {
        if (valores.length < 2) return '<div style="width: 100px; height: 30px; background: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">Sin datos</div>';
        
        const ultimos = valores.slice(-7); // Últimos 7 puntos
        const min = Math.min(...ultimos);
        const max = Math.max(...ultimos);
        const range = max - min || 1;
        
        let points = '';
        ultimos.forEach((val, i) => {
            const x = (i * 90) / (ultimos.length - 1) + 5;
            const y = 25 - ((val - min) / range) * 20;
            points += `${x},${y} `;
        });
        
        return `
            <svg width="100" height="30" style="border-radius: 4px; background: #f9f9f9;">
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
                ${ultimos.map((val, i) => {
                    const x = (i * 90) / (ultimos.length - 1) + 5;
                    const y = 25 - ((val - min) / range) * 20;
                    return `<circle cx="${x}" cy="${y}" r="1.5" fill="${color}"/>`;
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