
function mostrarSenha() {
    const passwordField = document.getElementById('login-password');
    const eyeIcon = document.getElementById('olho');
    
    passwordField.type = 'text';
    senhaVisivel = true;
    
    // Mudar ícone para indicar que pode ocultar
    eyeIcon.src = "https://cdn-icons-png.flaticon.com/512/2767/2767194.png";
}

function ocultarSenha() {
    const passwordField = document.getElementById('login-password');
    const eyeIcon = document.getElementById('olho');
    
    passwordField.type = 'password';
    senhaVisivel = false;
    
    // Voltar ícone original
    eyeIcon.src = "https://cdn0.iconfinder.com/data/icons/ui-icons-pack/100/ui-icon-pack-14-512.png";
}

// Função para toggle da senha (clique para mostrar/ocultar)
function toggleSenha() {
    if (senhaVisivel) {
        ocultarSenha();
    } else {
        mostrarSenha();
    }
}

// Função para ocultar senha quando sair do campo (blur)
function ocultarSenhaOnBlur() {
    if (senhaVisivel) {
        setTimeout(() => {
            ocultarSenha();
        }, 100); // Pequeno delay para evitar conflitos
    }
}