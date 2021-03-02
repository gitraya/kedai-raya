function initializeLiff() {
    liff
        .init({
            liffId: "1655458077-ywnGeJlR"
        })
        .then(() => {
            initializeApp();
        })
        .catch((err) => {
            console.log('Error sending message: ' + err);
        });
}

function initializeApp() {
    const loginButton = document.querySelector('#liff-login-button');
    const logoutButton = document.querySelector('#liff-logout-button');
    const mainPage = document.querySelector('#main-content');
    const loginPage = document.querySelector('#login-content');
    const externalButton = document.querySelector('#liff-external-browser-button');

    // main functions of applications
    function registerLiffFunctions() {
        // function get customer profile data
        liff.getProfile()
            .then(profile => {
                // display customer name
                const name = profile.displayName;
                for (let user of document.querySelectorAll('.customer')) {
                    user.textContent = name;
                };
                
                // display customer image
                const imgSrc = profile.pictureUrl;
                document.querySelector('#image-user').src = imgSrc;
            })
            .catch((err) => {
                console.log('Error sending message: ' + err);
            });

        // create a detailed shopping message
        let message = "";

        function messageText() {
            const products = document.querySelectorAll('.products');
            const customerName = document.querySelector('.customer');
            let name = document.querySelectorAll('#name');
            let price = document.querySelectorAll('#price');
            let quantity = document.querySelectorAll('#quantity');
            let total = document.querySelector('#total-cost');
            let product = [];
        
            for (let i = 0; i < products.length; i++) {
                productItem = `${name[i].textContent} ${quantity[i].textContent}pcs Harga/pcs: ${price[i].textContent}`;
                product.push(productItem)[i];
                
                message = `Hai ${customerName.textContent},

Terima kasih telah memesan di Kedai Raya, berikut ini ringkasan belanja mu:
                    
${product.join(`
`)}
                    
Totalnya jadi: ${total.textContent}
                    
Pesananmu akan segera di proses, jika sudah siap, kami akan mengantarnya segera mungkin.
                    
Mohon di tunggu ya!`
            };
            return message;
        }
    
        // function send messages to customer
        document.querySelector('#liff-action-button').addEventListener('click', () => {
            if (!liff.isInClient()) {
                window.alert('Maaf tidak dapat memesan jika lewat eksternal browser!');
            } else {
                messageText();
                liff.sendMessages([
                    {
                        'type': 'text',
                        'text': message
                    }
                ])
                .then(() => {
                    window.alert('Terima kasih pesanan mu segera di proses!');
                })
                .catch((err) => {
                    console.log('Error sending message: ' + err);
                });
            }
        });
    
        // function external button
        externalButton.addEventListener('click', () => {
            liff.openWindow({
                url: 'https://liff.line.me/1655458077-ywnGeJlR',
                external: true
            });
        });
    
        function authenticationButton(button) {
            button.addEventListener('click', () => {
                if (!liff.isLoggedIn()) {
                    liff.login();
                } else {
                    liff.logout();
                    window.location.reload();
                }
            })
        }

        authenticationButton(loginButton);
        authenticationButton(logoutButton);
    }

    // check what type of browser the user is using
    function checkBrowserType() {
        if (!liff.isInClient()) {
            if (!liff.isLoggedIn()) {
                mainPage.classList.add('hidden');
                logoutButton.classList.add('hidden');
                externalButton.classList.add('hidden');
            
                loginPage.classList.remove('hidden');
                loginButton.classList.remove('hidden');
            } else {
                loginPage.classList.add('hidden');
                loginButton.classList.add('hidden');
                externalButton.classList.add('hidden');
            
                mainPage.classList.remove('hidden');
                loginButton.classList.remove('hidden');
            }
        } else {
            mainPage.classList.add('hidden');
            loginButton.classList.add('hidden');
            logoutButton.classList.add('hidden');
            externalButton.classList.add('hidden');
            
            loginPage.classList.remove('hidden');
            document.querySelector('.login-message').innerText = "Harap tunggu sebentar beberapa detik!";

            liff.ready.then(() => {
                window.setTimeout(() => {
                    loginPage.classList.add('hidden');
                    loginButton.classList.add('hidden');
                    logoutButton.classList.add('hidden');
                
                    mainPage.classList.remove('hidden');
                    externalButton.classList.remove('hidden');
                }, 5*1000);
            });
        }
    }

    registerLiffFunctions();
    checkBrowserType();
}

initializeLiff();