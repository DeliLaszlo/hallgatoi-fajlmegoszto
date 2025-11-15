// Töltő képernyő kezelése
function showLoading(message = 'Betöltés...') {
    let loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) {
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-spinner">
                <img src="icons/hourglass.svg" alt="Betöltés">
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(loadingScreen);
    } else {
        const loadingText = loadingScreen.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }
    
    setTimeout(() => {
        loadingScreen.classList.add('active');
    }, 10);
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            if (loadingScreen.classList.contains('initial-loading')) {
                loadingScreen.remove();
                return;
            }
            loadingScreen.classList.remove('active');
        }, 10);
    }
}

window.onload = function() {
    setTimeout(() => {
        hideLoading();
    }, 1250);
};

document.addEventListener('DOMContentLoaded', function() {
    // Sötét mód váltó
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        function updateLogo(isDarkMode) {
            const logo = document.querySelector('.ivk_logo');
            if (logo) {
                if (isDarkMode) {
                    logo.src = 'icons/IVK_logo_dark.png';
                } else {
                    logo.src = 'icons/IVK_logo.png';
                }
            }
        }
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark_mode');
        }
        updateLogo(document.body.classList.contains('dark_mode'));
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark_mode');
            const isDarkMode = document.body.classList.contains('dark_mode');
            if (isDarkMode) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateLogo(isDarkMode);
        });
    }

    // Dashboard tárgyak generálása
    async function generateSubjects() {
        const subjectSection = document.getElementById('user_subjects');
        if (!subjectSection) return;
        subjectSection.innerHTML = '';

        try {
            const response = await fetch('php/getUserSubjects.php');
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a tárgyakat.');
            }
            
            const subjects = await response.json();
            
            if (subjects.length === 0) {
                subjectSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nincsenek felvett tárgyaid.</h2>'
                );
            } else {
                subjects.forEach(subject => {
                    subjectSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container own_subject_container">
                            <a href="subject.php?class_code=${encodeURIComponent(subject.class_code)}" class="container_link subject_link" aria-label="Tárgy megnyitása"></a>
                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            </button>
                            <h2>${subject.class_name}</h2>
                            <p>${subject.class_code}</p>
                            <p>${subject.file_count} fájl, ${subject.request_count} kérelem</p>
                        </div>
                    `);
                });
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            subjectSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiba történt a tárgyak betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateSubjects().then(() => {
            searchOwnSubjects();
        });
    }

    // Dashboard fájlok generálása
    function generateFiles() {
        const fileCount = 3; // Felhasználó fájlainak száma, PHP-val generált
        const fileSection = document.getElementById('dashboard_fajlok');
        if (fileSection) {
            if (fileCount === 0) {
                fileSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nem töltöttél fel fájlokat.</h2>'
                );
            } else {
                for (let i = 0; i < fileCount; i++) {
                    fileSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container own_file_container">
                            <a href="#" class="container_link own_details_link" data-up-id="" aria-label="Fájl megnyitása"></a> <!-- data-up-id PHP-val generált -->
                            <button class="button small_button content_download_button" aria-label="Letöltés">
                                <span class="icon_text">Letöltés</span>
                                <img src="icons/download.svg" alt="Letöltés">
                            </button>
                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            </button>
                            <h2>Fájl címe</h2> <!-- PHP-val generált -->
                            <p>Fájl leírása</p> <!-- PHP-val generált -->
                            <p>Feltöltés dátuma, tárgy neve</p> <!-- PHP-val generált -->
                        </div>
                    `);
                }
            }
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateFiles();
    }

    // Dashboard kérelmek generálása
    function generateRequests() {
        const requestCount = 3; // Felhasználó kérelemeinek száma, PHP-val generált
        const requestSection = document.getElementById('dashboard_kerelemek');
        if (requestSection) {
            if (requestCount === 0) {
                requestSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nincsenek kérelmeid.</h2>'
                );
            } else {
                for (let i = 0; i < requestCount; i++) {
                    const isCompleted = (i % 2 === 0); // Helyettesítendő PHP-val
                    if (isCompleted) {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container own_completed_request_container">
                                <span class="status_badge status_completed">
                                    <span class="icon_text">Teljesítve</span>
                                    <img src="icons/tick.svg" alt="Teljesítve" class="status_icon">  
                                </span>
                                <a href="#" class="container_link own_completed_requests_link" data-request-id="" aria-label="Kérelem megnyitása"></a> <!-- data-request-id PHP-val generált -->
                                <h2>Kérelem címe</h2> <!-- PHP-val generált -->
                                <p>Kérelem leírása</p> <!-- PHP-val generált -->
                                <p>Létrehozás dátuma, tárgy neve</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    } else {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container own_uncompleted_request_container">
                                <span class="status_badge status_uncompleted">
                                    <span class="icon_text">Várakozó</span>
                                    <img src="icons/hourglass.svg" alt="Várakozó" class="status_icon">
                                </span>
                                <a href="#" class="container_link own_uncompleted_requests_link" aria-label="Kérelem megnyitása"></a>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>Kérelem címe</h2> <!-- PHP-val generált -->
                                <p>Kérelem leírása</p> <!-- PHP-val generált -->
                                <p>Létrehozás dátuma, tárgy neve</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    }
                }
            }
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateRequests();
    }

    // Dashboard chatszobák generálása
    function generateChatrooms() {
        const ownChatroomCount = 2; // Felhasználó saját chatszobáinak száma, PHP-val generált
        const followedChatroomCount = 2; // Felhasználó követett chatszobáinak száma, PHP-val generált
        const chatroomSection = document.getElementById('dashboard_chatszobak');
        const firstHr = chatroomSection.querySelector('hr');
        if (chatroomSection) {
            if (ownChatroomCount === 0) {
                firstHr.insertAdjacentHTML('afterend', `
                    '<h2 class="no_content_message">Még nem hoztál létre chatszobát.</h2>'
                `);
            } else {
                for (let i = 0; i < ownChatroomCount; i++) {
                    firstHr.insertAdjacentHTML('afterend', `
                        <div class="content_container own_chatroom_container">
                            <a href="#" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                            <button class="button small_button content_edit_button edit_chatroom_button" aria-label="Szerkesztés">
                                <span class="icon_text">Szerkesztés</span>
                                <img src="icons/edit.svg" alt="Szerkesztés">
                            </button>
                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            </button>
                            <h2>Chatroom címe</h2> <!-- PHP-val generált -->
                            <p>Chatroom leírása</p> <!-- PHP-val generált -->
                            <p>Létrehozás dátuma, tárgy neve, követők száma</p> <!-- PHP-val generált -->
                        </div>
                    `);
                }
            }
            if (followedChatroomCount === 0) {
                chatroomSection.insertAdjacentHTML('beforeend', `
                    <h2 class="no_content_message">Még nem követsz chatszobát.</h2>
                `);
            } else {
                for (let i = 0; i < followedChatroomCount; i++) {
                    chatroomSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container followed_chatroom_container">
                            <a href="#" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                            <button class="button small_button content_unfollow_button" aria-label="Követés megszüntetése">
                                <span class="icon_text">Követés megszüntetése</span>
                                <img src="icons/unfollow.svg" alt="Követés megszüntetése">
                            </button>
                            <h2>Chatroom címe</h2> <!-- PHP-val generált -->
                            <p>Chatroom leírása</p> <!-- PHP-val generált -->
                            <p>Létrehozás dátuma, tárgy neve, követők száma</p> <!-- PHP-val generált -->
                        </div>
                    `);
                }
            }
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateChatrooms();
    }

    // Dashboard felvehető tárgyak generálása
    async function generateAvailableSubjects() {
        const subjectSection = document.getElementById('subject_list_container');
        if (!subjectSection) return;
        subjectSection.innerHTML = '';

        try {
            const response = await fetch('php/getAvailableSubjects.php');
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a felvehető tárgyakat.');
            }
            
            const subjects = await response.json();
            
            if (subjects.length === 0) {
                subjectSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Nincsenek felvehető tárgyak.</h2>'
                );
            } else {
                subjects.forEach(subject => {
                    subjectSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container available_subject_container">
                            <div class="subject_details">
                                <h2>${subject.class_name}</h2>
                                <p>${subject.class_code}</p>
                            </div>
                            <button class="button small_button subject_add_button" data-class-code="${subject.class_code}" aria-label="Tárgy felvétele">
                                <img src="icons/add.svg" alt="Felvétel">
                                <span class="icon_text">Felvétel</span>
                            </button>
                        </div>
                    `);
                });
            }
        } catch (error) {
            subjectSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiba történt a felvehető tárgyak betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateAvailableSubjects();
    }

    // Subject fájlok generálása
    function generateSubjectFiles() {
        const fileCount = 3; // Feltöltött fájlok száma, PHP-val generált
        const fileSection = document.getElementById('subject_fajlok');
        if (fileSection) {
            if (fileCount === 0) {
                fileSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nincsenek feltöltött fájlok ehhez a tárgyhoz.</h2>'
                );
            } else {
                for (let i = 0; i < fileCount; i++) {
                    const isOwnFile = (i % 2 === 0); // Helyettesítendő PHP-val
                    if (isOwnFile) {
                        fileSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container uploaded_files_container">
                                <a href="#" class="container_link own_details_link" data-up-id="" aria-label="Fájl részletei"></a> <!-- data-up-id PHP-val generált -->
                                <button class="button small_button content_download_button" aria-label="Letöltés">
                                    <span class="icon_text">Letöltés</span>
                                    <img src="icons/download.svg" alt="Letöltés">
                                </button>
                                <div class="content_downloads">
                                    <span>42<span class="hideable_text"> letöltés</span></span> <!-- PHP-val generált -->
                                    <img src="icons/download.svg" alt="Letöltések">
                                </div>
                                <div class="content_voting voting_container hideable_content">
                                    <span class="vote_count">17</span> <!-- PHP-val generált -->
                                    <img class="own_downvote_icon" src="icons/downvote.svg" alt="Nem tetszik">
                                    <img src="icons/upvote.svg" alt="Tetszik">
                                </div>
                                <h2>Fájl neve</h2> <!-- PHP-val generált -->
                                <p>Fájl leírása</p> <!-- PHP-val generált -->
                                <p>Te, feltöltés dátuma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    } else {
                        fileSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container uploaded_files_container">
                                <a href="#" class="container_link file_details_link" data-up-id="" aria-label="Fájl részletei"></a> <!-- data-up-id PHP-val generált -->
                                <button class="button small_button content_download_button" aria-label="Letöltés">
                                    <span class="icon_text">Letöltés</span>
                                    <img src="icons/download.svg" alt="Letöltés">
                                </button>
                                <div class="content_downloads">
                                    <span>42<span class="hideable_text"> letöltés</span></span> <!-- PHP-val generált -->
                                    <img src="icons/download.svg" alt="Letöltések">
                                </div>
                                <div class="content_voting voting_container hideable_content">
                                    <span class="vote_count">17</span> <!-- PHP-val generált -->
                                    <button class="button small_button content_downvote_button downvote_button" aria-label="Nem tetszik">
                                        <img src="icons/downvote.svg" alt="Nem tetszik">
                                    </button>  
                                    <button class="button small_button content_upvote_button upvote_button" aria-label="Tetszik">
                                        <img src="icons/upvote.svg" alt="Tetszik">
                                    </button>  
                                </div>
                                <h2>Fájl neve</h2> <!-- PHP-val generált -->
                                <p>Fájl leírása</p> <!-- PHP-val generált -->
                                <p>Feltöltő, feltöltés dátuma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    }
                }
            }
        }
    }
    if (window.location.pathname.includes('subject.php')) {
        generateSubjectFiles();
    }

    // Subject kérelmek generálása
    function generateSubjectRequests() {
        const requestCount = 3; // Kérelmek száma, PHP-val generált
        const requestSection = document.getElementById('subject_kerelemek');
        if (requestSection) {
            if (requestCount === 0) {
                requestSection.insertAdjacentHTML('beforeend',
                    '<h2 class="no_content_message">Még nincsenek kérelmek ehhez a tárgyhoz.</h2>'
                );
            } else {
                for (let i = 0; i < requestCount; i++) {
                    const isOwnRequest = (i % 2 === 0); // Helyettesítendő PHP-val
                    if (isOwnRequest) {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container">
                                <a href="#" class="container_link own_uncompleted_requests_link" aria-label="Kérelem megnyitása"></a>
                                <button class="button small_button content_edit_button edit_request_button" aria-label="Szerkesztés">
                                    <span class="icon_text">Szerkesztés</span>
                                    <img src="icons/edit.svg" alt="Szerkesztés">
                                </button>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>Kérelem címe</h2> <!-- PHP-val generált -->
                                <p>Kérelem leírása</p> <!-- PHP-val generált --> 
                                <p>Te, feltöltés dátuma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    } else {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container">
                                <a href="#" class="container_link upload_file_button" aria-label="Fájl feltöltése"></a>
                                <button class="button small_button content_upload_button upload_file_button" aria-label="Fájl feltöltése">
                                    <span class="icon_text">Fájl feltöltése</span>
                                    <img src="icons/upload.svg" alt="Fájl feltöltése">
                                </button>
                                <button class="button small_button content_report_button report_button" aria-label="Kérelem jelentése">
                                    <span class="icon_text">Jelentés</span>
                                    <img src="icons/report.svg" alt="Kérelem jelentése">
                                </button>
                                <h2>Kérelem címe</h2> <!-- PHP-val generált -->
                                <p>Kérelem leírása</p> <!-- PHP-val generált -->
                                <p>Kérelmező, feltöltés dátuma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    }
                }
            }
        }
    }
    if (window.location.pathname.includes('subject.php')) {
        generateSubjectRequests();
    }

    // Subject chatszobák generálása
    function generateSubjectChatrooms() {
        const chatroomCount = 3; // Chatszobák száma, PHP-val generált
        const chatroomSection = document.getElementById('subject_chatszobak');
        if (chatroomSection) {
            if (chatroomCount === 0) {
                chatroomSection.insertAdjacentHTML('beforeend',
                    '<h2 class="no_content_message">Még nincsenek chatszobák ehhez a tárgyhoz.</h2>'
                );
            } else {
                for (let i = 0; i < chatroomCount; i++) {
                    const isOwnChatroom = (i % 2 === 0); // Helyettesítendő PHP-val
                    if (isOwnChatroom) {
                        chatroomSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container chatroom_container">
                                <a href="#" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                                <button class="button small_button content_edit_button edit_chatroom_button" aria-label="Szerkesztés">
                                    <span class="icon_text">Szerkesztés</span>
                                    <img src="icons/edit.svg" alt="Szerkesztés">
                                </button>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>Chatroom címe</h2> <!-- PHP-val generált -->
                                <p>Chatroom leírása</p> <!-- PHP-val generált -->
                                <p>Te, követők száma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    } else {
                        chatroomSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container chatroom_container">
                                <a href="#" class="container_link chatroom_link" aria-label="Chatszoba megnyitása"></a>
                                <button class="button small_button content_follow_button" aria-label="Követés">
                                    <span class="icon_text">Követés</span>
                                    <img src="icons/follow.svg" alt="Követés">
                                </button>
                                <button class="button small_button content_unfollow_button" aria-label="Követés megszüntetése" style="display: none;">
                                    <span class="icon_text">Követés megszüntetése</span>
                                    <img src="icons/unfollow.svg" alt="Követés megszüntetése">
                                </button>
                                <button class="button small_button content_report_button report_button" aria-label="Chatszoba jelentése">
                                    <span class="icon_text">Jelentés</span>
                                    <img src="icons/report.svg" alt="Chatszoba jelentése">
                                </button>
                                <h2>Chatszoba címe</h2> <!-- PHP-val generált -->
                                <p>Chatszoba leírása</p> <!-- PHP-val generált -->
                                <p>Létrehozó, követők száma</p> <!-- PHP-val generált -->
                            </div>
                        `);
                    }
                }
            }
        }
    }
    if (window.location.pathname.includes('subject.php')) {
        generateSubjectChatrooms();
    }

    // Bejelentkezés és regisztráció közötti váltás
    const loginDiv = document.getElementById('login');
    const registerDiv = document.getElementById('register');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    if (loginDiv && registerDiv) {
        if (window.location.hash === '#register') {
            loginDiv.style.display = 'none';
            registerDiv.style.display = 'block';
            const neptunInput = document.getElementById('registerNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
        } else {
            loginDiv.style.display = 'block';
            registerDiv.style.display = 'none';
            const neptunInput = document.getElementById('loginNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
        }
    }

    window.addEventListener('hashchange', function() {
        if (loginDiv && registerDiv) {
            if (window.location.hash === '#register') {
                loginDiv.style.display = 'none';
                registerDiv.style.display = 'block';
                const neptunInput = document.getElementById('registerNeptun');
                if (neptunInput) {
                    neptunInput.focus();
                }
            } else {
                loginDiv.style.display = 'block';
                registerDiv.style.display = 'none';
                const neptunInput = document.getElementById('loginNeptun');
                if (neptunInput) {
                    neptunInput.focus();
                }
            }
        }
    });

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
        fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
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
                alert('A teljes név 2-50 karakter hosszú lehet, csak betűket és legalább 1 szóközt tartalmazhat!');
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

    // Navbar kezelése
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const navLinks = {};
        const navListItems = navMenu.querySelectorAll('ul li a[id^="nav_"]'); 
        navListItems.forEach(function(navLink) {
            const navId = navLink.id;
            let sectionName = navId.replace(/^nav_sajat_/, '').replace(/^nav_/, '');  
            let sectionId = null;
            // Bővítendő új oldal esetén
            const possiblePrefixes = ['dashboard_', 'subject_', ''];
            for (let prefix of possiblePrefixes) {
                const testId = prefix + sectionName;
                if (document.getElementById(testId)) {
                    sectionId = testId;
                    break;
                }
            }
            if (sectionId) {
                navLinks[navId] = sectionId;
            }
        });

        // Hamburger menü kezelés
        const hamburger = document.querySelector('.hamburger');
        const activeSectionName = document.querySelector('.active-section-name');
        if (hamburger) {
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

        // Szekció váltás
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

            // Fájl keresés törlése szekció váltáskor
            const fileSearchInput = document.getElementById('file_search_input');
            if (fileSearchInput) {
                fileSearchInput.value = '';
                fileSearchInput.dispatchEvent(new Event('input'));
            }

            // Tárgy keresés törlése szekció váltáskor
            const subjectSearchInput = document.getElementById('dashboard_subject_search');
            if (subjectSearchInput) {
                subjectSearchInput.value = '';
                subjectSearchInput.dispatchEvent(new Event('input'));
            }
        }

        Object.keys(navLinks).forEach(function(navId) {
            const navLink = document.getElementById(navId);
            if (navLink) {
                navLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    switchSection(navLinks[navId]);
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            }
        });

        // Kezdeti szekció betöltése
        const firstSectionId = Object.values(navLinks)[0];
        if (firstSectionId) {
            switchSection(firstSectionId);
        }
    }

    // Modal bezárás
    const modalCloseButtons = document.querySelectorAll('.modal_close_button');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.classList.add('hidden');
    });

    function closeModal(modal) {
        // Modal tartalom tetejére görgetés
        const modalContent = modal.querySelector('.modal_content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        modal.classList.add('closing');
        setTimeout(function() {
            modal.classList.remove('closing');
            modal.classList.add('hidden');
            
            // Keresés visszaállítása
            const searchContainer = modal.querySelector('.search_container');
            if (searchContainer) {
                const searchInput = searchContainer.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
            }
            
            // Fájl feltöltés modal értékek visszaállítása
            if (modal.classList.contains('upload_file_modal')) {
                const fileTitle = document.getElementById('file_title');
                const fileUpload = document.getElementById('file_upload');
                const fileDescription = document.getElementById('file_description');
                
                if (fileTitle) {
                    fileTitle.value = '';
                }
                if (fileUpload) {
                    fileUpload.value = '';
                }
                if (fileDescription) {
                    fileDescription.value = '';
                }
            }
            
            // Szerkesztés modal értékek visszaállítása
            if (modal.classList.contains('small_modal')) {
                const checkbox = modal.querySelector('#replace_file_checkbox');
                const fileUploadSection = modal.querySelector('#file_upload_section');
                const fileInput = modal.querySelector('#fileUpload');
                
                if (checkbox) {
                    checkbox.checked = false;
                }
                if (fileUploadSection) {
                    fileUploadSection.style.display = 'none';
                }
                if (fileInput) {
                    fileInput.value = '';
                }
            }

            // Kérelem modal visszaállítása
            if (modal.classList.contains('add_request_modal')) {
                const requestTitle = modal.querySelector('#request_title');
                const requestDescription = modal.querySelector('#request_description');

                if (requestTitle) {
                    requestTitle.value = '';
                }
                if (requestDescription) {
                    requestDescription.value = '';
                }
            }

            // Jelentés modal visszaállítása
            if (modal.classList.contains('report_content_modal')) {
                const reportDescription = modal.querySelector('#report_description');
                if (reportDescription) {
                    reportDescription.value = '';
                }
            }

            // Chatszoba modal visszaállítása
            if (modal.classList.contains('add_chatroom_modal')) {
                const chatroomTitle = modal.querySelector('#chatroom_title');
                const chatroomDescription = modal.querySelector('#chatroom_description');
                if (chatroomTitle) {
                    chatroomTitle.value = '';
                }
                if (chatroomDescription) {
                    chatroomDescription.value = '';
                }
            }
        }, 400);
    }

    // Modal bezárás gombra kattintáskor
    const allCloseButtons = document.querySelectorAll('.modal_close_button, .edit_close_button, .upload_close_button, .request_close_button, .report_close_button, .chatroom_close_button');
    allCloseButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const parentModal = button.closest('.modal');
            if (parentModal && !parentModal.classList.contains('hidden')) {
                closeModal(parentModal);
            }
        });
    });

    // Modal bezárás háttérre kattintáskor
    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Új tárgy felvétele modal megnyitása
    const addSubjectButton = document.querySelector('.add_subject_button');
    if (addSubjectButton) {
        addSubjectButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Felvehető tárgyak betöltése...");
            generateAvailableSubjects().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const addSubjectModal = document.querySelector('.add_subject_modal');
                    if (addSubjectModal) {
                        addSubjectModal.classList.remove('hidden');
                    }  
                }, 500);
            });
        });
    }

    // Új kérelem modal megnyitása
    const addRequestButtons = document.querySelectorAll('.add_request_button');
    addRequestButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addRequestModal = document.querySelector('.add_request_modal');
            if (addRequestModal) {
                addRequestModal.classList.remove('hidden');
            }
        });
    });

    // Új chatszoba modal megnyitása
    const addChatroomButtons = document.querySelectorAll('.add_chatroom_button');
    addChatroomButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addChatroomModal = document.querySelector('.add_chatroom_modal');
            if (addChatroomModal) {
                addChatroomModal.classList.remove('hidden');
            }
        });
    });

    // Fájl feltöltés modal megnyitása
    const uploadFileButtons = document.querySelectorAll('.upload_file_button');
    uploadFileButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const uploadFileModal = document.querySelector('.upload_file_modal');
            if (uploadFileModal) {
                uploadFileModal.classList.remove('hidden');
            }
        });
    });

    // Jelentés modal megnyitása
    const reportButtons = document.querySelectorAll('.report_button');
    reportButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const reportModal = document.querySelector('.report_content_modal');
            if (reportModal) {
                reportModal.classList.remove('hidden');
            }
        });
    });

    // Fájl részletei modal megnyitása és adatok betöltése
    document.addEventListener('click', async function(e) {
        const link = e.target.closest('.file_details_link');
        if (link) {
            e.preventDefault();
            const upId = link.getAttribute('data-up-id');
            
            if (!upId) {
                alert('Hiányzó fájl azonosító');
                return;
            }
            
            showLoading('Fájl részleteinek betöltése...');
            
            try {
                const response = await fetch(`getFileDetails.php?mode=upload&id=${upId}`);
                
                if (!response.ok) {
                    throw new Error('Hiba a fájl részleteinek betöltésekor');
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message || 'Ismeretlen hiba');
                }
                
                const data = result.data;
                const fileDetailsModal = document.querySelector('.file_details_modal');
                
                if (fileDetailsModal) {
                    // Adatok beállítása a modalban
                    const titleElement = fileDetailsModal.querySelector('.data-file-title');
                    const uploaderElement = fileDetailsModal.querySelector('.data-file-uploader');
                    const fileNameElement = fileDetailsModal.querySelector('.data-file-name');
                    const dateElement = fileDetailsModal.querySelector('.data-file-date');
                    const sizeElement = fileDetailsModal.querySelector('.data-file-size');
                    const downloadsElement = fileDetailsModal.querySelector('.data-file-downloads');
                    const ratingElement = fileDetailsModal.querySelector('.data-file-rating');
                    const descriptionElement = fileDetailsModal.querySelector('.data-file-description');
                    
                    if (titleElement) titleElement.textContent = data.title;
                    if (uploaderElement) uploaderElement.textContent = data.uploader;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
                    if (sizeElement) sizeElement.textContent = data.file_size;
                    if (downloadsElement) downloadsElement.textContent = data.downloads;
                    if (ratingElement) ratingElement.textContent = data.rating;
                    if (descriptionElement) descriptionElement.textContent = data.description;
                    
                    // Loading eltűntetése kis késleltetéssel
                    setTimeout(() => {
                        hideLoading();
                        // Modal megjelenítése
                        fileDetailsModal.classList.remove('hidden');
                    }, 1250);
                }
                
            } catch (error) {
                console.error('Hiba:', error);
                hideLoading();
                alert('Hiba történt a fájl részleteinek betöltése közben: ' + error.message);
            }
        }
    });

    // Saját fájl részletei modal megnyitása és adatok betöltése
    document.addEventListener('click', async function(e) {
        const link = e.target.closest('.own_details_link');
        if (link) {
            e.preventDefault();
            const upId = link.getAttribute('data-up-id');
            
            if (!upId) {
                alert('Hiányzó fájl azonosító');
                return;
            }
            
            showLoading('Fájl részleteinek betöltése...');
            
            try {
                const response = await fetch(`getFileDetails.php?mode=upload&id=${upId}`);
                
                if (!response.ok) {
                    throw new Error('Hiba a fájl részleteinek betöltésekor');
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message || 'Ismeretlen hiba');
                }
                
                const data = result.data;
                const ownFileModal = document.querySelector('.own_file_details_modal');
                
                if (ownFileModal) {
                    // Adatok beállítása a modalban
                    const titleElement = ownFileModal.querySelector('.data-file-title');
                    const fileNameElement = ownFileModal.querySelector('.data-file-name');
                    const subjectElement = ownFileModal.querySelector('.data-file-subject');
                    const dateElement = ownFileModal.querySelector('.data-file-date');
                    const sizeElement = ownFileModal.querySelector('.data-file-size');
                    const downloadsElement = ownFileModal.querySelector('.data-file-downloads');
                    const ratingElement = ownFileModal.querySelector('.data-file-rating');
                    const descriptionElement = ownFileModal.querySelector('.data-file-description');
                    
                    if (titleElement) titleElement.textContent = data.title;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (subjectElement) subjectElement.textContent = data.class_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
                    if (sizeElement) sizeElement.textContent = data.file_size;
                    if (downloadsElement) downloadsElement.textContent = data.downloads;
                    if (ratingElement) ratingElement.textContent = data.rating;
                    if (descriptionElement) descriptionElement.textContent = data.description;
                    
                    // Loading eltüntetése kis késleltetéssel
                    setTimeout(() => {
                        hideLoading();
                        // Modal megjelenítése
                        ownFileModal.classList.remove('hidden');
                    }, 1250);
                }
                
            } catch (error) {
                console.error('Hiba:', error);
                hideLoading();
                alert('Hiba történt a fájl részleteinek betöltése közben: ' + error.message);
            }
        }
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

    // Saját teljesített kérelmek modal megnyitása és adatok betöltése
    document.addEventListener('click', async function(e) {
        const link = e.target.closest('.own_completed_requests_link');
        if (link) {
            e.preventDefault();
            const requestId = link.getAttribute('data-request-id');
            
            if (!requestId) {
                alert('Hiányzó kérelem azonosító');
                return;
            }
            
            showLoading('Kérelem részleteinek betöltése...');
            
            try {
                const response = await fetch(`getFileDetails.php?mode=request&id=${requestId}`);
                
                if (!response.ok) {
                    throw new Error('Hiba a kérelem részleteinek betöltésekor');
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message || 'Ismeretlen hiba');
                }
                
                const data = result.data;
                const ownCompletedRequestsModal = document.querySelector('.own_completed_requests_modal');
                
                if (ownCompletedRequestsModal) {
                    // Adatok beállítása a modalban
                    const requestTitleElement = ownCompletedRequestsModal.querySelector('.data-request-title');
                    const fileTitleElement = ownCompletedRequestsModal.querySelector('.data-file-title');
                    const uploaderElement = ownCompletedRequestsModal.querySelector('.data-file-uploader');
                    const fileNameElement = ownCompletedRequestsModal.querySelector('.data-file-name');
                    const subjectElement = ownCompletedRequestsModal.querySelector('.data-file-subject');
                    const dateElement = ownCompletedRequestsModal.querySelector('.data-file-date');
                    const sizeElement = ownCompletedRequestsModal.querySelector('.data-file-size');
                    const downloadsElement = ownCompletedRequestsModal.querySelector('.data-file-downloads');
                    const ratingElement = ownCompletedRequestsModal.querySelector('.data-file-rating');
                    const descriptionElement = ownCompletedRequestsModal.querySelector('.data-file-description');
                    
                    if (requestTitleElement) requestTitleElement.textContent = data.request_name;
                    if (fileTitleElement) fileTitleElement.textContent = data.title;
                    if (uploaderElement) uploaderElement.textContent = data.uploader;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (subjectElement) subjectElement.textContent = data.class_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
                    if (sizeElement) sizeElement.textContent = data.file_size;
                    if (downloadsElement) downloadsElement.textContent = data.downloads;
                    if (ratingElement) ratingElement.textContent = data.rating;
                    if (descriptionElement) descriptionElement.textContent = data.description;
                    
                    // Loading eltűntetése kis késleltetéssel
                    setTimeout(() => {
                        hideLoading();
                        // Modal megjelenítése
                        ownCompletedRequestsModal.classList.remove('hidden');
                    }, 1250);
                }
                
            } catch (error) {
                console.error('Hiba:', error);
                hideLoading();
                alert('Hiba történt a kérelem részleteinek betöltése közben: ' + error.message);
            }
        }
    });

    // Fájl szerkesztés modal megnyitása
    const editFileButtons = document.querySelectorAll('.edit_file_button');
    editFileButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const editFileModal = document.querySelector('.edit_file_modal');
            if (editFileModal) {
                editFileModal.classList.remove('hidden');
            }
        });
    });

    // Fájl feltöltés szekció megjelenítése/elrejtése
    const replaceFileCheckbox = document.getElementById('replace_file_checkbox');
    const fileUploadSection = document.getElementById('file_upload_section');
    if (replaceFileCheckbox && fileUploadSection) {
        replaceFileCheckbox.addEventListener('change', function() {
            if (this.checked) {
                fileUploadSection.style.display = 'block';
            } else {
                fileUploadSection.style.display = 'none';
                const fileInput = document.getElementById('fileUpload');
                if (fileInput) {
                    fileInput.value = '';
                }
            }
        });
    }

    // Kérelem szerkesztés modal megnyitása
    const editRequestButtons = document.querySelectorAll('.edit_request_button');
    editRequestButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const editRequestModal = document.querySelector('.edit_request_modal');
            if (editRequestModal) {
                editRequestModal.classList.remove('hidden');
            }
        });
    });

    // Chatszoba szerkesztés modal megnyitása
    const editChatroomButtons = document.querySelectorAll('.edit_chatroom_button');
    editChatroomButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const editChatroomModal = document.querySelector('.edit_chatroom_modal');
            if (editChatroomModal) {
                editChatroomModal.classList.remove('hidden');
            }
        });
    });

    // Profil adatok betöltése
    async function loadProfileData() {
        try {
            const response = await fetch('php/profile_get.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a profil adatokat');
            }
            
            const data = await response.json();
            const neptunInput = document.getElementById('profile_neptun');
            const usernameInput = document.getElementById('profile_username');
            const fullnameInput = document.getElementById('profile_fullname');
            const emailInput = document.getElementById('profile_email');
            
            if (neptunInput) neptunInput.value = data.neptun || '';
            if (usernameInput) usernameInput.value = data.nickname || '';
            if (fullnameInput) fullnameInput.value = data.full_name || '';
            if (emailInput) emailInput.value = data.email || '';
            
        } catch (error) {
            console.error('Hiba a profil betöltése közben:', error);
        }
    }
    
    // Csak a dashboard.php oldalon töltődik be a profil adat
    if (window.location.pathname.includes('dashboard.php')) {
        loadProfileData();
    }

    // Profil szerkesztés
    const editProfileButton = document.querySelector('.edit_profile_button');
    const cancelProfileButton = document.querySelector('.cancel_profile_button');
    const passwordFields = document.getElementById('password_fields');
    const profileEditButtons = document.getElementById('profile_edit_buttons');
    const profileInputs = [
        document.getElementById('profile_username'),
        document.getElementById('profile_fullname'),
        document.getElementById('profile_neptun'),
        document.getElementById('profile_email')
    ];
    
    if (editProfileButton) {
        editProfileButton.addEventListener('click', function(e) {
            e.preventDefault();
            profileInputs.forEach(function(input) {
                if (input) {
                    input.removeAttribute('readonly');
                    input.setAttribute('required', 'required');
                }
            });
            if (passwordFields) {
                passwordFields.style.display = 'block';
            }
            editProfileButton.style.display = 'none';
            if (profileEditButtons) {
                profileEditButtons.style.display = 'flex';
            }
        });
    }
    
    if (cancelProfileButton) {
        cancelProfileButton.addEventListener('click', function(e) {
            e.preventDefault();
            profileInputs.forEach(function(input) {
                if (input) {
                    input.setAttribute('readonly', 'readonly');
                    input.removeAttribute('required');
                }
            });
            if (passwordFields) {
                passwordFields.style.display = 'none';
            }
            if (profileEditButtons) {
                profileEditButtons.style.display = 'none';
            }
            if (editProfileButton) {
                editProfileButton.style.display = 'flex';
            }
            // Kezdeti adatok visszaállítása
            loadProfileData();
        });
    }

    // Profil frissítés
    const profileForm = document.getElementById('profile_form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const usernameInput = document.getElementById('profile_username');
            const fullnameInput = document.getElementById('profile_fullname');
            const emailInput = document.getElementById('profile_email');
            const currentPasswordInput = document.getElementById('profile_current_password');
            const newPasswordInput = document.getElementById('profile_new_password');
            const repeatPasswordInput = document.getElementById('profile_repeat_password');
            
            const username = usernameInput?.value.trim() || '';
            const fullname = fullnameInput?.value.trim() || '';
            const email = emailInput?.value.trim() || '';
            const currentPassword = currentPasswordInput?.value || '';
            const newPassword = newPasswordInput?.value || '';
            const repeatPassword = repeatPasswordInput?.value || '';
            
            // Érvényesítési minták
            const patterns = {
                username: /^[a-zA-Z0-9_]{3,20}$/,
                fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
            };
            
            if (!patterns.username.test(username)) {
                alert('Érvénytelen felhasználónév! 3-20 karakter, csak betűk, számok és aláhúzás.');
                return;
            }
            
            if (!patterns.fullname.test(fullname)) {
                alert('Érvénytelen név! Vezetéknév és legalább egy keresztnév szükséges.');
                return;
            }
            
            if (!patterns.email.test(email)) {
                alert('Érvénytelen email cím!');
                return;
            }
            
            if (currentPassword || newPassword || repeatPassword) {
                if (!currentPassword) {
                    alert('Add meg a jelenlegi jelszavadat!');
                    return;
                }
                
                if (!newPassword) {
                    alert('Add meg az új jelszavadat!');
                    return;
                }
                
                if (!patterns.password.test(newPassword)) {
                    alert('Az új jelszó legalább 8 karakter hosszú legyen, tartalmazzon nagybetűt és számot!');
                    return;
                }
                
                if (newPassword !== repeatPassword) {
                    alert('Az új jelszavak nem egyeznek!');
                    return;
                }
            }
            
            // Küldendő adatok előkészítése
            const data = {
                username: username,
                fullname: fullname,
                email: email,
                current_password: currentPassword,
                new_password: newPassword
            };
            
            try {
                const response = await fetch('php/profile_update.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert(result.message || 'Profil sikeresen frissítve!');
                    profileInputs.forEach(function(input) {
                        if (input) {
                            input.setAttribute('readonly', 'readonly');
                            input.removeAttribute('required');
                        }
                    });
                    
                    if (passwordFields) {
                        passwordFields.style.display = 'none';
                        if (currentPasswordInput) currentPasswordInput.value = '';
                        if (newPasswordInput) newPasswordInput.value = '';
                        if (repeatPasswordInput) repeatPasswordInput.value = '';
                    }
                    
                    if (profileEditButtons) {
                        profileEditButtons.style.display = 'none';
                    }
                    
                    if (editProfileButton) {
                        editProfileButton.style.display = 'flex';
                    }
                    
                    // Profiladatok újratöltése
                    loadProfileData();
                } else {
                    alert(result.error || 'Hiba történt a profil frissítése során!');
                }
            } catch (error) {
                console.error('Hiba a profil frissítése közben:', error);
                alert('Hiba történt a profil frissítése során!');
            }
        });
    }

    // Tárgyfelvétel keresés
    const subjectSearchInput = document.getElementById('subject_search_input');
    if (subjectSearchInput) {
        subjectSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const subjectContainers = document.querySelectorAll('.available_subject_container');     
            subjectContainers.forEach(function(container) {
                const subjectName = container.querySelector('h2');
                const subjectCode = container.querySelector('p');
                
                if (subjectName && subjectCode) {
                    const nameText = subjectName.textContent.toLowerCase();
                    const codeText = subjectCode.textContent.toLowerCase();
                    
                    if (searchTerm === '' || nameText.includes(searchTerm) || codeText.includes(searchTerm)) {
                        container.style.display = 'flex';
                    } else {
                        container.style.display = 'none';
                    }
                }
            });
        });
    }

    // Felvett tárgyak keresése
    function searchOwnSubjects() {
        const ownSubjectSearchInput = document.querySelector('.subject_search_input');
        if (ownSubjectSearchInput) {
            ownSubjectSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const subjectContainers = document.querySelectorAll('.own_subject_container');     
                subjectContainers.forEach(function(container) {
                    const subjectName = container.querySelector('h2');
                    const subjectCode = container.querySelector('p');
                    
                    if (subjectName && subjectCode) {
                        const nameText = subjectName.textContent.toLowerCase();
                        const codeText = subjectCode.textContent.toLowerCase();
                        
                        if (searchTerm === '' || nameText.includes(searchTerm) || codeText.includes(searchTerm)) {
                            container.style.display = 'block';
                        } else {
                            container.style.display = 'none';
                        }
                    }
                });
            });
        }
    }


    // Fájl keresés
    const fileSearchInput = document.getElementById('file_search_input');
    if (fileSearchInput) {
        fileSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const fileContainers = document.querySelectorAll('.uploaded_files_container');
            fileContainers.forEach(function(container) {
                const fileName = container.querySelector('h2');
                const fileParagraphs = container.querySelectorAll('p');
                
                if (fileName) {
                    const nameText = fileName.textContent.toLowerCase();
                    let paragraphText = '';
                    fileParagraphs.forEach(function(p) {
                        paragraphText += p.textContent.toLowerCase() + ' ';
                    });
                    
                    if (searchTerm === '' || nameText.includes(searchTerm) || paragraphText.includes(searchTerm)) {
                        container.style.display = 'block';
                    } else {
                        container.style.display = 'none';
                    }
                }
            });
        });
    }

    // Követés gombok közötti váltás
    const followButtons = document.querySelectorAll('.content_follow_button');
    const unfollowButtons = document.querySelectorAll('.content_unfollow_button');
    followButtons.forEach(function(followButton) {
        followButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const container = followButton.closest('.content_container');
            const unfollowButton = container ? container.querySelector('.content_unfollow_button') : null;         
            if (unfollowButton) {
                followButton.style.display = 'none';
                unfollowButton.style.display = 'flex';
            }
        });
    });
    unfollowButtons.forEach(function(unfollowButton) {
        unfollowButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const container = unfollowButton.closest('.content_container');
            const followButton = container ? container.querySelector('.content_follow_button') : null;       
            if (followButton) {
                unfollowButton.style.display = 'none';
                followButton.style.display = 'flex';
            }
        });
    });

    // Upvote és downvote kezelés
    const upvoteButtons = document.querySelectorAll('.upvote_button');
    const downvoteButtons = document.querySelectorAll('.downvote_button');
    upvoteButtons.forEach(function(upvoteButton) {
        upvoteButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();  
            const container = upvoteButton.closest('.voting_container');
            const downvoteButton = container ? container.querySelector('.downvote_button') : null;
            upvoteButton.classList.toggle('active');
            if (upvoteButton.classList.contains('active') && downvoteButton) {
                downvoteButton.classList.remove('active');
            }
        });
    });
    downvoteButtons.forEach(function(downvoteButton) {
        downvoteButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const container = downvoteButton.closest('.voting_container');
            const upvoteButton = container ? container.querySelector('.upvote_button') : null;
            downvoteButton.classList.toggle('active');
            if (downvoteButton.classList.contains('active') && upvoteButton) {
                upvoteButton.classList.remove('active');
            }
        });
    });

// Chatszoba
(() => {
    // Csak akkor fut, ha chatszoba oldalon vagyunk
    const chatroomPage = document.getElementById('chatszobak');
    if (!chatroomPage) return;

    // Chatszobák generálása
    function generateChatrooms() {
        const chatroomCount = 3; // Felhasználó saját és követett chatszobáinak száma, PHP-val generált
        const chatConvList = document.getElementById('chat_conv_list');
        if (chatConvList && chatroomCount > 0) {
            chatConvList.innerHTML = '';
            for (let i = 0; i < chatroomCount; i++) {
                chatConvList.insertAdjacentHTML('beforeend', `
                    <li><a class="chat_list_item" data-room-id="${i + 1}">Chatszoba ${i + 1}</a></li>
                `); // TODO: Backend - Chatszoba név és ID PHP-ból
            }
        }
    }
    generateChatrooms();

    const chatMessages = document.getElementById('chat_messages');
    const chatText = document.getElementById('chat_text');
    const chatComposer = document.getElementById('chat_composer');
    const chatListItems = document.querySelectorAll('.chat_list_item');
    let activeChatroomId = null;

    // Kezdeti chatszoba betöltése
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('room_id');
    
    if (roomIdFromUrl) {
        const roomInList = Array.from(chatListItems).find(item => item.dataset.roomId === roomIdFromUrl);
        if (roomInList) {
            roomInList.classList.add('active');
            activeChatroomId = roomInList.dataset.roomId;
        } else {
            // Ha a felhasználó nem része a szobának
            // TODO: Backend - Ellenőrizd, hogy a szoba létezik-e
            
            activeChatroomId = roomIdFromUrl;
        }
        // TODO: Backend - Szoba üzeneteinek betöltése
        chatMessages.innerHTML = '<div class="chat_row other"><div class="chat_bubble"><div>Üdv a szobában!</div><div class="chat_meta">Rendszer • ' + getCurrentTimestamp() + '</div></div></div>';
    } 
    else if (chatListItems.length > 0) {
        const firstRoom = chatListItems[0];
        firstRoom.classList.add('active');
        activeChatroomId = firstRoom.dataset.roomId;
        
        // TODO: Backend - Szoba üzeneteinek betöltése
        
        chatMessages.innerHTML = '<div class="chat_row other"><div class="chat_bubble"><div>Üdv a szobában!</div><div class="chat_meta">Rendszer • ' + getCurrentTimestamp() + '</div></div></div>';
    }

    // Chatszoba váltás
    chatListItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedRoomId = this.dataset.roomId;
            if (selectedRoomId === activeChatroomId) return;
            chatListItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            activeChatroomId = selectedRoomId;

            // TODO: Backend - Kiválasztott szoba üzeneteinek betöltése

            // Példa üzenet, törölhető
            chatMessages.innerHTML = '<div class="chat_row other"><div class="chat_bubble"><div>Üdv a szobában!</div><div class="chat_meta">Rendszer • ' + getCurrentTimestamp() + '</div></div></div>';
        });
    });

    // Üzenet küldése
    chatComposer.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const messageText = chatText.value.trim();
        if (!messageText) return;

        // TODO: Backend - Üzenet mentése adatbázisba

        displayMessage(messageText, true);
        chatText.value = '';
    });

    // Enter küldéshez
    chatText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatComposer.dispatchEvent(new Event('submit'));
        }
    });

    // Üzenet megjelenítése
    function displayMessage(text, isMe = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat_row ${isMe ? 'me' : 'other'}`;
        messageDiv.innerHTML = `
            <div class="chat_bubble ${isMe ? 'me' : ''}">
                <div>${escapeHtml(text)}</div>
                <div class="chat_meta">${isMe ? 'Én' : 'Felhasználó'} • ${getCurrentTimestamp()}</div>
            </div>
        `; // TODO: Backend - Felhasználónév és időbélyeg az adatbázisból
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Időbélyeg formázása
    function getCurrentTimestamp() {
        const now = new Date();
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    function pad(num) {
        return String(num).padStart(2, '0');
    }

    // HTML escape - megakadályozza, hogy rosszindulatú HTML/JavaScript kód fusson le
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Chatszoba keresés
    const chatroomSearchInput = document.getElementById('chatroom_search_input');
    if (chatroomSearchInput) {
        chatroomSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            chatListItems.forEach(function(item) {
                const chatroomName = item.textContent.toLowerCase();
                if (searchTerm === '' || chatroomName.includes(searchTerm)) {
                    item.parentElement.style.display = 'block';
                } else {
                    item.parentElement.style.display = 'none';
                }
            });
        });
    }
    // TODO: Backend - Új üzenetek időszakos lekérése (pl. AJAX segítségével)
})();

    // Tárgy felvétele
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.subject_add_button')) {
            const button = e.target.closest('.subject_add_button');
            const classCode = button.getAttribute('data-class-code');
            
            if (!classCode) return;
            button.disabled = true;
            
            try {
                const response = await fetch('php/add_subject.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ class_code: classCode })
                });
                
                if (!response.ok) {
                    throw new Error('Nem sikerült felvenni a tárgyat.');
                }
                
                const result = await response.json();    
                if (result.success) {
                    // Gomb megjelenésének módosítása
                    const imgElement = button.querySelector('img');
                    const textElement = button.querySelector('.icon_text');
                    
                    if (imgElement) {
                        imgElement.src = 'icons/tick.svg';
                        imgElement.alt = 'Felvéve';
                    }
                    if (textElement) {
                        textElement.textContent = 'Felvéve';
                    }
                    button.setAttribute('aria-label', 'Tárgy felvéve');
                    
                    // Tárgy hozzáadása a saját tárgyak közé
                    const userSubjectsSection = document.getElementById('user_subjects');
                    if (userSubjectsSection) {
                        // Ha "Még nincsenek felvett tárgyaid" üzenet van, távolítsuk el
                        const noContentMessage = userSubjectsSection.querySelector('.no_content_message');
                        if (noContentMessage) {
                            noContentMessage.remove();
                        }
                        
                        // Tárgy adatainak lekérése a backend-től
                        try {
                            const subjectsResponse = await fetch('php/getUserSubjects.php');
                            if (subjectsResponse.ok) {
                                const subjects = await subjectsResponse.json();
                                const addedSubject = subjects.find(s => s.class_code === classCode);
                                
                                if (addedSubject) {
                                    userSubjectsSection.insertAdjacentHTML('beforeend', `
                                        <div class="content_container own_subject_container">
                                            <a href="subject.php?class_code=${encodeURIComponent(addedSubject.class_code)}" class="container_link subject_link" aria-label="Tárgy megnyitása"></a>
                                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                                <span class="icon_text">Törlés</span>
                                                <img src="icons/delete.svg" alt="Törlés">
                                            </button>
                                            <h2>${addedSubject.class_name}</h2>
                                            <p>${addedSubject.class_code}</p>
                                            <p>${addedSubject.file_count} fájl, ${addedSubject.request_count} kérelem</p>
                                        </div>
                                    `);
                                    
                                    // Keresés újrainicializálása az új tárggyal
                                    searchOwnSubjects();
                                }
                            }
                            alert('Tárgy sikeresen felvéve!');
                        } catch (error) {
                            console.error('Hiba történt a tárgy részleteinek lekérésekor:', error);
                        }
                    }
                } else {
                    throw new Error(result.error || 'Ismeretlen hiba történt.');
                }
            } catch (error) {
                console.error('Error adding subject:', error);
                alert('Hiba történt a tárgy felvételekor: ' + error.message);
                button.disabled = false;
            }
        }
    });
});