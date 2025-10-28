// Função para carregar os estados (UFs)
async function carregarUFs() {
    try {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';
        const response = await fetch(url);
        const ufs = await response.json();
        
        const selectUf = document.getElementById('select-uf');
        
        // Limpar opções existentes (exceto a primeira)
        selectUf.innerHTML = '<option value="">Selecione um Estado</option>';
        
        // Adicionar cada UF ao select
        for (const uf of ufs) {
            const option = document.createElement('option');
            option.value = uf.id;
            option.textContent = uf.nome;
            selectUf.appendChild(option);
        }
        
        console.log('Estados carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar estados:', error);
    }
}

// Função para carregar as cidades (municípios)
async function carregarCidades() {
    const selectUf = document.getElementById('select-uf');
    const selectCidade = document.getElementById('select-cidade');
    
    const ufId = selectUf.value;
    
    // Limpar o seletor de cidades
    selectCidade.innerHTML = '<option value="">Escolha uma cidade</option>';
    
    // Verificar se uma UF foi selecionada
    if (!ufId || ufId === '') {
        selectCidade.disabled = true;
        return;
    }
    
    try {
        // Habilitar o seletor de cidades
        selectCidade.disabled = false;
        
        // Buscar municípios da UF selecionada
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios?orderBy=nome`;
        const response = await fetch(url);
        const municipios = await response.json();
        
        // Adicionar cada município ao select
        for (const municipio of municipios) {
            const option = document.createElement('option');
            option.value = municipio.id;
            option.textContent = municipio.nome;
            selectCidade.appendChild(option);
        }
        
        console.log('Cidades carregadas com sucesso');
    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        selectCidade.disabled = true;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar estados ao inicializar a página
    carregarUFs();
    
    // Adicionar listener ao select de UF
    const selectUf = document.getElementById('select-uf');
    if (selectUf) {
        selectUf.addEventListener('change', carregarCidades);
    }
    
    // Verificar se o usuário já está logado
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado === 'true') {
        console.log('Usuário já logado, mostrando IBGE');
        // A página já deve estar mostrando a div IBGE, mas vamos garantir
        document.getElementById('divLocalidadesIBGE').style.display = 'block';
    }
});

