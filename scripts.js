document.addEventListener('DOMContentLoaded', function() {
    // index.php
    // Bejelentkezés és regisztráció közötti váltás
    const loginDiv = document.getElementById('login');
    const registerDiv = document.getElementById('register');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginDiv.style.display = 'none';
            registerDiv.style.display = 'block';
            const neptunInput = document.getElementById('registerNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
        });

        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerDiv.style.display = 'none';
            loginDiv.style.display = 'block';
            const neptunInput = document.getElementById('loginNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
        });
    }

    // Input ellenőrzés regisztrációnál
    const patterns = {
        neptun: /^[A-Z0-9]{6}$/i,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
    };

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const neptun = document.getElementById('registerNeptun').value;
            const username = document.getElementById('registerUsername').value;
            const fullname = document.getElementById('registerFullname').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Neptun
            if (!patterns.neptun.test(neptun)) {
                e.preventDefault();
                alert('A Neptun kód 6 alfanumerikus karakterből kell álljon!');
                return false;
            }
            
            // Felhasználónév
            if (!patterns.username.test(username)) {
                e.preventDefault();
                alert('A felhasználónév 3-20 karakter hosszú lehet, csak betűket, számokat és aláhúzást tartalmazhat!');
                return false;
            }
            
            // Teljes név
            if (!patterns.fullname.test(fullname)) {
                e.preventDefault();
                alert('A teljes név 2-50 karakter hosszú lehet, csak betűket és szóközöket tartalmazhat!');
                return false;
            }
            
            // Email
            if (!patterns.email.test(email)) {
                e.preventDefault();
                alert('Kérem adjon meg egy érvényes email címet!');
                return false;
            }
            
            // Jelszó
            if (!patterns.password.test(password)) {
                e.preventDefault();
                alert('A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább 1 nagybetűt és 1 számot!');
                return false;
            }

            // Jelszó megerősítése
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('A jelszavak nem egyeznek!');
                return false;
            }
        });
    }

    // dashboard.php
    // Navigáció a szekciók között
    const dashboardCheck = document.getElementById('nav_targyak');
    if (dashboardCheck) {
        const navLinks = {
            'nav_targyak': 'dashboard_targyak',
            'nav_fajlok': 'dashboard_fajlok',
            'nav_kerelemek': 'dashboard_kerelemek',
            'nav_chatszobak': 'dashboard_chatszobak',
            'nav_profil': 'dashboard_profil'
        };

        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const activeSectionName = document.querySelector('.active-section-name');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            document.addEventListener('click', function(e) {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }

        function updateActiveSectionName(navId) {
            const navLink = document.getElementById(navId);
            if (navLink && activeSectionName) {
                activeSectionName.textContent = navLink.textContent;
            }
        }

        function switchSection(sectionId) {
            Object.values(navLinks).forEach(function(id) {
                const section = document.getElementById(id);
                if (section) {
                    section.style.display = 'none';
                }
            });

            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.style.display = 'block';
            }

            Object.keys(navLinks).forEach(function(navId) {
                const navLink = document.getElementById(navId);
                if (navLink) {
                    navLink.classList.remove('active');
                }
            });

            Object.keys(navLinks).forEach(function(navId) {
                if (navLinks[navId] === sectionId) {
                    const navLink = document.getElementById(navId);
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                    updateActiveSectionName(navId);
                }
            });
        }

        Object.keys(navLinks).forEach(function(navId) {
            const navLink = document.getElementById(navId);
            if (navLink) {
                navLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    switchSection(navLinks[navId]);
                    
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            }
        });

        switchSection('dashboard_targyak');
    }

    // Modal bezárás
    const modalCloseButtons = document.querySelectorAll('.modal_close_button');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.classList.add('hidden');
    });

    function closeModal(modal) {
        modal.classList.add('closing');
        setTimeout(function() {
            modal.classList.remove('closing');
            modal.classList.add('hidden');
        }, 400);
    }

    modalCloseButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            modals.forEach(function(modal) {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal);
                }
            });
        });
    });

    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Saját fájlok modal megnyitása
    const ownDetailsLinks = document.querySelectorAll('.own_details_link');
    ownDetailsLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const ownFileModal = document.querySelector('.own_file_details_modal');
            if (ownFileModal) {
                ownFileModal.classList.remove('hidden');
            }
        });
    });

    // Saját teljesítetlen kérelmek modal megnyitása
    const ownUncompletedRequestsLinks = document.querySelectorAll('.own_uncompleted_requests_link');
    ownUncompletedRequestsLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const ownUncompletedRequestsModal = document.querySelector('.own_uncompleted_requests_modal');
            if (ownUncompletedRequestsModal) {
                ownUncompletedRequestsModal.classList.remove('hidden');
            }
        });
    });

    // Saját teljesített kérelmek modal megnyitása
    const ownCompletedRequestsLinks = document.querySelectorAll('.own_completed_requests_link');
    ownCompletedRequestsLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const ownCompletedRequestsModal = document.querySelector('.own_completed_requests_modal');
            if (ownCompletedRequestsModal) {
                ownCompletedRequestsModal.classList.remove('hidden');
            }
        });
    });
});