document.addEventListener('DOMContentLoaded', function() {
            const sizeSlider = document.getElementById('size');
            const sizeValue = document.getElementById('sizeValue');
            const distanceForm = document.getElementById('distanceForm');
            const resultBox = document.getElementById('resultBox');
            const resetButton = document.getElementById('resetButton');
            const copyResultBtn = document.getElementById('copyResultBtn');
            const newCalcBtn = document.getElementById('newCalcBtn');
            const loadingOverlay = document.getElementById('loadingOverlay');
            
            showLoading(1000);
            
            sizeSlider.value = 10;
            sizeValue.textContent = sizeSlider.value;
            
            sizeSlider.addEventListener('input', updateSliderValue);
            
            distanceForm.addEventListener('submit', handleFormSubmit);
            
            resetButton.addEventListener('click', resetForm);
            
            copyResultBtn.addEventListener('click', copyResult);
            
            newCalcBtn.addEventListener('click', resetForm);
            
            setupRealTimeValidation();
            
            
            function updateSliderValue() {
                sizeValue.textContent = sizeSlider.value;
                const fontSize = 1.5 + (sizeSlider.value / 10);
                sizeValue.style.fontSize = `${fontSize}rem`;
            }
            
            function handleFormSubmit(e) {
                e.preventDefault();
                
                const months = parseFloat(document.getElementById('months').value);
                const weekly = parseFloat(document.getElementById('weekly').value);
                const size = parseInt(sizeSlider.value);
                
                if (!validateInputs(months, weekly, size)) {
                    return;
                }
                
                showLoading(800);
                
                setTimeout(() => {
                    const meters = months * weekly * size * 19.2;
                    const kilometers = meters / 1000;
                    
                    document.getElementById('kilometers').textContent = kilometers.toFixed(1);
                    document.getElementById('mValue').textContent = months;
                    document.getElementById('sValue').textContent = weekly;
                    document.getElementById('tValue').textContent = size;
                    
                    document.getElementById('formContainer').classList.add('d-none');
                    
                    resultBox.classList.remove('d-none');
                    
                    
                    setTimeout(() => {
                        resultBox.classList.add('show');
                        
       
                        showToast('Cálculo Concluído', 'Sua quilometragem foi calculada com sucesso.', 'success');
                        

                    }, 100);
                    
                }, 800); 
            }
            
            function validateInputs(months, weekly, size) {
                let isValid = true;
                let errorMessage = '';
                
                if (!months || isNaN(months)) {
                    errorMessage = 'Por favor, informe um valor válido para Tempo em Meses.';
                    isValid = false;
                } else if (months <= 0) {
                    errorMessage = 'O Tempo em Meses deve ser maior que zero.';
                    isValid = false;
                }
                
                if (isValid && (!weekly || isNaN(weekly))) {
                    errorMessage = 'Por favor, informe um valor válido para Média Semanal.';
                    isValid = false;
                } else if (isValid && weekly <= 0) {
                    errorMessage = 'A Média Semanal deve ser maior que zero.';
                    isValid = false;
                }
                
                if (!isValid) {
                    showToast('Erro no Formulário', errorMessage, 'error');
                }
                
                return isValid;
            }
            
            function showToast(title, message, type) {
                const toastContainer = document.querySelector('.toast-container');
                
                const toast = document.createElement('div');
                toast.classList.add('toast');
                
                const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
                
                toast.innerHTML = `
                    <div class="toast-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-message">${message}</div>
                    </div>
                    <button class="toast-close">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                toastContainer.appendChild(toast);
                
                setTimeout(() => {
                    toast.classList.add('show');
                }, 10);
                
                const closeButton = toast.querySelector('.toast-close');
                closeButton.addEventListener('click', () => {
                    dismissToast(toast, toastContainer);
                });
                
                setTimeout(() => {
                    dismissToast(toast, toastContainer);
                }, 5000);
            }
            
            function dismissToast(toast, container) {
                if (container.contains(toast)) {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        if (container.contains(toast)) {
                            container.removeChild(toast);
                        }
                    }, 400);
                }
            }
            
            function setupRealTimeValidation() {
                const inputs = document.querySelectorAll('input[type="number"]');
                inputs.forEach(input => {
                    input.addEventListener('input', function() {
                        if (this.value && parseFloat(this.value) <= 0) {
                            this.classList.add('is-invalid');
                        } else {
                            this.classList.remove('is-invalid');
                        }
                    });
                });
            }
            
            function resetForm() {
                document.getElementById('formContainer').classList.remove('d-none');
                
                distanceForm.reset();
                sizeSlider.value = 10;
                updateSliderValue();
                resultBox.classList.remove('show');
                
                setTimeout(() => {
                    resultBox.classList.add('d-none');
                }, 300);
                
                document.querySelectorAll('.is-invalid').forEach(el => {
                    el.classList.remove('is-invalid');
                });
                
                showToast('Formulário Resetado', 'Todos os campos foram limpos.', 'success');
            }
            
            function copyResult() {
                const kilometers = document.getElementById('kilometers').textContent;
                const months = document.getElementById('mValue').textContent;
                const weekly = document.getElementById('sValue').textContent;
                const size = document.getElementById('tValue').textContent;
                
                const textToCopy = `Quilometragem Total: ${kilometers} km\n` +
                                   `Valores utilizados:\n` +
                                   `- Meses (M): ${months}\n` +
                                   `- Média Semanal (S): ${weekly}\n` +
                                   `- Tamanho (T): ${size}`;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('Copiado!', 'Resultado copiado para a área de transferência.', 'success');
                }).catch(err => {
                    showToast('Erro', 'Não foi possível copiar o texto.', 'error');
                    console.error('Erro ao copiar: ', err);
                });
            }
            
            function showLoading(duration = 1000) {
                loadingOverlay.classList.add('visible');
                
                setTimeout(() => {
                    loadingOverlay.classList.remove('visible');
                }, duration);
            }
        });