// Aguardar o carregamento completo da página
window.addEventListener('load', function() {
    console.log('Page loaded');
    
    // Verificar se estamos na página de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        
        // Adicionar evento de submit ao formulário
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            
            console.log('Email:', email);
            
            // Validação básica de email
            if (email && email.includes('@') && email.includes('.')) {
                console.log('Email valid, redirecting...');
                // Redirecionar para a página de membros
                window.location.href = 'membros.html';
            } else {
                alert('Please enter a valid email address');
            }
        });
        
        // Também adicionar evento ao botão diretamente
        const submitButton = loginForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Button clicked');
                
                const emailInput = document.getElementById('email');
                const email = emailInput.value.trim();
                
                console.log('Email from button click:', email);
                
                // Validação básica de email
                if (email && email.includes('@') && email.includes('.')) {
                    console.log('Email valid from button, redirecting...');
                    // Redirecionar para a página de membros
                    window.location.href = 'membros.html';
                } else {
                    alert('Please enter a valid email address');
                }
            });
        }
    }
    
    // Lógica para a página de módulos (se existir)
    const moduleTitleDisplay = document.getElementById("moduleTitleDisplay");
    if (moduleTitleDisplay) {
        const params = new URLSearchParams(window.location.search);
        const moduleType = params.get("type");
        const moduleName = decodeURIComponent(params.get("name") || "Module");
        const moduleSrc = decodeURIComponent(params.get("src") || "");
        
        document.title = `${moduleName} - Members Area`;
        moduleTitleDisplay.textContent = moduleName;
        
        if (moduleType === "ebook" && moduleSrc) {
            const ebookContentDiv = document.getElementById("ebookContent");
            const videoAreaDiv = document.getElementById("videoArea");
            
            if (ebookContentDiv && videoAreaDiv) {
                ebookContentDiv.style.display = "block";
                videoAreaDiv.style.display = "none";
                const iframe = ebookContentDiv.querySelector("iframe");
                if (iframe) {
                    iframe.src = moduleSrc;
                }
            }
        }
    }
});

