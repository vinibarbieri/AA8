// Variável global para controlar visibilidade da senha
let senhaVisivel = false;

// Classe para validação de CPF
class CPF {
    constructor(cpf) {
        this.cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        if (!this.validarFormato()) {
            throw new Error('CPF deve conter exatamente 11 dígitos');
        }
        
        if (!this.validarDigitos()) {
            throw new Error('CPF inválido - dígitos verificadores incorretos');
        }
        
        if (this.todosDigitosIguais()) {
            throw new Error('CPF inválido - todos os dígitos são iguais');
        }
    }
    
    validarFormato() {
        return this.cpf.length === 11;
    }
    
    todosDigitosIguais() {
        return /^(\d)\1{10}$/.test(this.cpf);
    }
    
    validarDigitos() {
        let soma = 0;
        let resto;
        
        // Validação do primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(this.cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(this.cpf.substring(9, 10))) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(this.cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(this.cpf.substring(10, 11))) return false;
        
        return true;
    }
    
    toString() {
        return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}

// Classe para representar uma conta
class Conta {
    constructor(nome, sobrenome, cpf, email, senha) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf; // Objeto CPF já validado
        this.email = email;
        this.senha = senha;
        this.dataCriacao = new Date();
    }
    
    toString() {
        return `Conta criada: ${this.nome} ${this.sobrenome}, CPF: ${this.cpf.toString()}, Email: ${this.email}`;
    }
}

// Função para ocultar elementos
function ocultarElementos() {
    document.getElementById('login-body').style.display = 'none';
    document.getElementById('nova-conta').style.display = 'none';
    document.getElementById('divHome').style.display = 'block';
}

// Função para mostrar apenas a home
function mostrarApenasHome() {
    ocultarElementos();
}

// Função para mostrar apenas o login
function mostrarApenasLogin() {
    document.getElementById('divHome').style.display = 'none';
    document.getElementById('nova-conta').style.display = 'none';
    document.getElementById('login-body').style.display = 'block';
    
    // Resetar campos do login
    resetarFormularioLogin();
}

// Função para mostrar apenas a criação de conta
function mostrarApenasConta() {
    document.getElementById('divHome').style.display = 'none';
    document.getElementById('login-body').style.display = 'none';
    document.getElementById('nova-conta').style.display = 'block';
    
    // Resetar campos do formulário de conta
    resetarFormularioConta();
}

// Função para resetar formulário de login
function resetarFormularioLogin() {
    const form = document.querySelector('#login-body form');
    form.reset();
    document.getElementById('botaoLogin').disabled = true;
    senhaVisivel = false;
    document.getElementById('login-password').type = 'password';
}

// Função para resetar formulário de conta
function resetarFormularioConta() {
    const form = document.querySelector('#nova-conta form');
    form.reset();
    
    // Limpar todas as mensagens de status
    const statusElements = ['statusNome', 'statusSobrenome', 'statusCPF', 'statusEmail', 'statusSenha', 'statusRepitaSenha'];
    statusElements.forEach(id => {
        const element = document.getElementById(id);
        element.textContent = '';
        element.className = '';
    });
    
    // Desabilitar botão criar conta
    const botaoCriarConta = document.querySelector('#areaBotaoConta input');
    botaoCriarConta.disabled = true;
}

// Função para validar email
function validarEmail(email) {
    const arrobas = (email.match(/@/g) || []).length;
    return arrobas === 1 && email.trim() !== '';
}

// Função para validar texto em branco
function validaTextoEmBranco(input, statusId, campoNome) {
    const status = document.getElementById(statusId);
    const valor = input.value.trim();
    
    if (valor === '') {
        status.textContent = `${campoNome} não pode estar vazio`;
        status.className = 'status-fail';
        return false;
    } else {
        status.textContent = '✓';
        status.className = 'status-ok';
        return true;
    }
}

// Função para validar CPF
function validarCPF(input) {
    const status = document.getElementById('statusCPF');
    const valor = input.value.trim();
    
    if (valor === '') {
        status.textContent = 'CPF não pode estar vazio';
        status.className = 'status-fail';
        return false;
    }
    
    try {
        const cpf = new CPF(valor);
        status.textContent = '✓';
        status.className = 'status-ok';
        return true;
    } catch (error) {
        status.textContent = error.message;
        status.className = 'status-fail';
        return false;
    }
}

// Função para validar email no formulário de conta
function validarEmailConta(input) {
    const status = document.getElementById('statusEmail');
    const valor = input.value.trim();
    
    if (valor === '') {
        status.textContent = 'E-mail não pode estar vazio';
        status.className = 'status-fail';
        return false;
    }
    
    if (!validarEmail(valor)) {
        status.textContent = 'E-mail deve conter exatamente um @';
        status.className = 'status-fail';
        return false;
    }
    
    status.textContent = '✓';
    status.className = 'status-ok';
    return true;
}

// Função para validar senha
function validarSenha(input) {
    const status = document.getElementById('statusSenha');
    const valor = input.value;
    
    if (valor === '') {
        status.textContent = 'Senha não pode estar vazia';
        status.className = 'status-fail';
        return false;
    }
    
    // Verificar força da senha
    let forca = 0;
    if (valor.length >= 8) forca++;
    if (/[A-Z]/.test(valor)) forca++;
    if (/[a-z]/.test(valor)) forca++;
    if (/[0-9]/.test(valor)) forca++;
    if (/[^A-Za-z0-9]/.test(valor)) forca++;
    
    let mensagemForca = '';
    if (forca <= 2) mensagemForca = ' (Fraca)';
    else if (forca <= 3) mensagemForca = ' (Média)';
    else mensagemForca = ' (Forte)';
    
    status.textContent = '✓' + mensagemForca;
    status.className = 'status-ok';
    return true;
}

// Função para validar repetição de senha
function validarRepitaSenha(input) {
    const status = document.getElementById('statusRepitaSenha');
    const senha = document.getElementById('campoSenha').value;
    const valor = input.value;
    
    if (valor === '') {
        status.textContent = 'Repita sua senha não pode estar vazio';
        status.className = 'status-fail';
        return false;
    }
    
    if (valor !== senha) {
        status.textContent = 'Senhas não coincidem';
        status.className = 'status-fail';
        return false;
    }
    
    status.textContent = '✓';
    status.className = 'status-ok';
    return true;
}

// Função para verificar se todos os campos estão válidos
function verificarCamposValidos() {
    const statusIds = ['statusNome', 'statusSobrenome', 'statusCPF', 'statusEmail', 'statusSenha', 'statusRepitaSenha'];
    
    return statusIds.every(statusId => {
        const status = document.getElementById(statusId);
        return status && status.className === 'status-ok';
    });
}

// Função para habilitar/desabilitar botão criar conta
function atualizarBotaoCriarConta() {
    const botao = document.querySelector('#areaBotaoConta input');
    const todosValidos = verificarCamposValidos();
    botao.disabled = !todosValidos;
    
    console.log('Atualizando botão criar conta. Válidos:', todosValidos, 'Botão habilitado:', !botao.disabled);
}

// Função para criar conta
function criarConta() {
    if (!verificarCamposValidos()) {
        alert('Todos os campos devem estar válidos para criar a conta');
        return;
    }
    
    // Usar IDs únicos para seletores mais confiáveis
    const nomeInput = document.getElementById('campoNome');
    const sobrenomeInput = document.getElementById('campoSobrenome');
    const cpfInput = document.getElementById('campoCPF');
    const emailInput = document.getElementById('campoEmail');
    const senhaInput = document.getElementById('campoSenha');
    
    // Verificar se todos os elementos foram encontrados
    if (!nomeInput || !sobrenomeInput || !cpfInput || !emailInput || !senhaInput) {
        console.error('Alguns campos não foram encontrados:', {
            nome: !!nomeInput,
            sobrenome: !!sobrenomeInput,
            cpf: !!cpfInput,
            email: !!emailInput,
            senha: !!senhaInput
        });
        alert('Erro: Alguns campos não foram encontrados. Verifique o console para mais detalhes.');
        return;
    }
    
    const nome = nomeInput.value.trim();
    const sobrenome = sobrenomeInput.value.trim();
    const cpfValor = cpfInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    
    try {
        const cpf = new CPF(cpfValor);
        const conta = new Conta(nome, sobrenome, cpf, email, senha);
        
        console.log(conta.toString());
        alert('Conta criada com sucesso! Verifique o console para mais detalhes.');
        
        // Resetar formulário após criação
        resetarFormularioConta();
        mostrarApenasHome();
    } catch (error) {
        alert('Erro ao criar conta: ' + error.message);
    }
}

// Função para validar login
function validarLogin() {
    const email = document.querySelector('#login-body input[type="text"]').value.trim();
    const senha = document.querySelector('#login-body input[type="password"]').value;
    const botao = document.getElementById('botaoLogin');
    
    if (email !== '' && senha !== '' && validarEmail(email)) {
        botao.disabled = false;
    } else {
        botao.disabled = true;
    }
}

// Função para fazer login
function fazerLogin() {
    const email = document.querySelector('#login-body input[type="text"]').value.trim();
    const senha = document.querySelector('#login-body input[type="password"]').value;
    
    if (!validarEmail(email)) {
        alert('E-mail inválido');
        return;
    }
    
    if (senha === '') {
        alert('Senha não pode estar vazia');
        return;
    }
    
    alert('Login realizado com sucesso!');
    mostrarApenasHome();
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Ocultar formulários ao carregar a página
    ocultarElementos();
    
    // Adicionar event listeners para validação em tempo real do login
    const emailLogin = document.querySelector('#login-body input[type="text"]');
    const senhaLogin = document.querySelector('#login-body input[type="password"]');
    
    if (emailLogin) {
        emailLogin.addEventListener('input', validarLogin);
    }
    if (senhaLogin) {
        senhaLogin.addEventListener('input', validarLogin);
    }
    
    // Adicionar event listeners para validação em tempo real da conta
    const camposConta = document.querySelectorAll('#nova-conta input');
    
    camposConta.forEach((campo, index) => {
        campo.addEventListener('blur', function() {
            // Chamar a função de validação específica baseada no campo
            if (this.getAttribute('onblur')) {
                eval(this.getAttribute('onblur'));
            }
            atualizarBotaoCriarConta();
        });
    });
    
    // Adicionar event listener para o botão criar conta
    const botaoCriarConta = document.querySelector('#areaBotaoConta input');
    if (botaoCriarConta) {
        botaoCriarConta.addEventListener('click', function(e) {
            e.preventDefault();
            criarConta();
        });
    } else {
        console.error('Botão criar conta não encontrado!');
    }
    
    // Adicionar event listener para o botão de login
    const botaoLogin = document.getElementById('botaoLogin');
    if (botaoLogin) {
        botaoLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão login clicado');
            fazerLogin();
        });
    }
    
});
