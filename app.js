class CoralTrack {
    constructor() {
        this.parametros = JSON.parse(localStorage.getItem('parametros')) || [];
        this.fotos = JSON.parse(localStorage.getItem('fotos')) || { pachyclavularia: [], palythoa: [] };
        this.charts = {};
        this.init();
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
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
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
        
        this.renderCharts();
        this.renderHistorial();
        document.getElementById('parametros-form').reset();
        this.setFechaActual();
    }

    renderCharts() {
        const chartsContainer = document.getElementById('charts');
        chartsContainer.innerHTML = '';
        
        if (this.parametros.length === 0) return;

        const parametrosNumericos = ['densidad', 'kh', 'calcio', 'magnesio', 'nitratos', 'fosfatos', 'temperatura'];
        const labels = ['Densidad', 'KH', 'Calcio (ppm)', 'Magnesio (ppm)', 'Nitratos (ppm)', 'Fosfatos (ppm)', 'Temperatura (°C)'];
        
        parametrosNumericos.forEach((param, index) => {
            const data = this.parametros
                .filter(p => p[param] !== null)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            
            if (data.length === 0) return;

            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart-item';
            chartDiv.innerHTML = `
                <h4>${labels[index]}</h4>
                <canvas id="chart-${param}" width="400" height="200"></canvas>
            `;
            chartsContainer.appendChild(chartDiv);

            const ctx = document.getElementById(`chart-${param}`).getContext('2d');
            
            this.charts[param] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => new Date(d.fecha).toLocaleDateString()),
                    datasets: [{
                        label: labels[index],
                        data: data.map(d => d[param]),
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: (context) => `Fecha: ${context[0].label}`,
                                label: (context) => `${labels[index]}: ${context.parsed.y}`
                            }
                        }
                    },
                    scales: {
                        y: { beginAtZero: false }
                    }
                }
            });
        });
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
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
}

const app = new CoralTrack();