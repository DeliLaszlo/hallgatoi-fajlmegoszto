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
    // Flag a form váltás érzékeléséhez (register form blur események letiltására)
    let isRegisterFormSwitching = false;
    
    // HTML escape - megakadályozza, hogy rosszindulatú HTML/JavaScript kód fusson le
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
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
                            <h2>${escapeHtml(subject.class_name)}</h2>
                            <p>${escapeHtml(subject.class_code)}</p>
                            <p>${escapeHtml(subject.file_count.toString())} fájl, ${escapeHtml(subject.request_count.toString())} kérelem</p>
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
    async function generateFiles() {
        const fileSection = document.getElementById('dashboard_file_container');
        if (!fileSection) return;
        fileSection.innerHTML = '';

        try {
            const response = await fetch('php/getFiles.php?mode=neptun');
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a fájlokat.');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Ismeretlen hiba');
            }
            
            const files = result.files;
            
            if (files.length === 0) {
                fileSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nem töltöttél fel fájlokat.</h2>'
                );
            } else {
                files.forEach(file => {
                    fileSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container uploaded_files_container own_file_container">
                            <a href="#" class="container_link own_details_link" data-up-id="${file.up_id}" aria-label="Fájl megnyitása"></a>
                            <button class="button small_button content_download_button" aria-label="Letöltés">
                                <span class="icon_text">Letöltés</span>
                                <img src="icons/download.svg" alt="Letöltés">
                            </button>
                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            </button>
                            <h2>${escapeHtml(file.title)}</h2>
                            <p>${escapeHtml(file.description)}</p>
                            <p>${escapeHtml(file.upload_date)}, ${escapeHtml(file.class_name)}</p>
                        </div>
                    `);
                });
            }
        } catch (error) {
            console.error('Error loading files:', error);
            fileSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiba történt a fájlok betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateFiles();
    }

    // Dashboard kérelmek generálása
    async function generateRequests() {
        const requestSection = document.getElementById('dashboard_request_container');
        if (!requestSection) return;
        requestSection.innerHTML = '';

        try {
            const response = await fetch('php/getRequests.php?mode=neptun');
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a kérelmeket.');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Hiba történt');
            }
            
            const requests = result.requests;
            
            if (requests.length === 0) {
                requestSection.insertAdjacentHTML('beforeend',
                    '<h2 class="no_content_message">Még nincsenek kérelmeid.</h2>'
                );
            } else {
                requests.forEach(request => {
                    if (request.is_completed) {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container own_completed_request_container">
                                <span class="status_badge status_completed">
                                    <span class="icon_text">Teljesítve</span>
                                    <img src="icons/tick.svg" alt="Teljesítve" class="status_icon">  
                                </span>
                                <a href="#" class="container_link own_completed_requests_link" data-request-id="${request.request_id}" aria-label="Kérelem megnyitása"></a>
                                <h2>${escapeHtml(request.request_name)}</h2>
                                <p>${escapeHtml(request.description)}</p>
                                <p>${escapeHtml(request.request_date)}, ${escapeHtml(request.class_name)}</p>
                            </div>
                        `);
                    } else {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container own_uncompleted_request_container">
                                <span class="status_badge status_uncompleted">
                                    <span class="icon_text">Várakozó</span>
                                    <img src="icons/hourglass.svg" alt="Várakozó" class="status_icon">
                                </span>
                                <a href="#" class="container_link own_uncompleted_requests_link" data-request-id="${request.request_id}" aria-label="Kérelem megnyitása"></a>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>${escapeHtml(request.request_name)}</h2>
                                <p>${escapeHtml(request.description)}</p>
                                <p>${escapeHtml(request.request_date)}, ${escapeHtml(request.class_name)}</p>
                            </div>
                        `);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            requestSection.insertAdjacentHTML('beforeend',
                '<h2 class="no_content_message">Hiba történt a kérelmek betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('dashboard.php')) {
        generateRequests();
    }

    // Dashboard chatszobák generálása
    async function generateChatrooms() {
        const chatroomSection = document.getElementById('dashboard_chatszobak');
        if (!chatroomSection) return;
        
        const firstHr = chatroomSection.querySelector('hr');

        try {
            const response = await fetch('php/getChatrooms.php?mode=neptun');
            const data = await response.json();

            if (!data.success) {
                console.error('Hiba a chatszobák betöltésekor:', data.message);
                return;
            }

            const ownChatrooms = data.chatrooms.filter(chatroom => chatroom.chatroom_type === 'own');
            const followedChatrooms = data.chatrooms.filter(chatroom => chatroom.chatroom_type === 'followed');

            // Saját chatszobák megjelenítése
            if (ownChatrooms.length === 0) {
                firstHr.insertAdjacentHTML('afterend', `
                    <h2 class="no_content_message">Még nem hoztál létre chatszobát.</h2><br>
                `);
            } else {
                ownChatrooms.forEach(chatroom => {
                    firstHr.insertAdjacentHTML('afterend', `
                        <div class="content_container chatroom_container own_chatroom_container" data-room-id="${escapeHtml(chatroom.room_id)}">
                            <a href="chatroom.php?room_id=${escapeHtml(chatroom.room_id)}" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                            <button class="button small_button content_edit_button edit_chatroom_button" aria-label="Szerkesztés">
                                <span class="icon_text">Szerkesztés</span>
                                <img src="icons/edit.svg" alt="Szerkesztés">
                            </button>
                            <button class="button small_button content_delete_button" aria-label="Törlés">
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            </button>
                            <h2>${escapeHtml(chatroom.title)}</h2>
                            <p>${escapeHtml(chatroom.description)}</p>
                            <p>${chatroom.create_date ? escapeHtml(chatroom.create_date) + ', ' : ''}${escapeHtml(chatroom.class_name)}</p>
                        </div>
                    `);
                });
            }

            // Követett chatszobák megjelenítése
            if (followedChatrooms.length === 0) {
                chatroomSection.insertAdjacentHTML('beforeend', `
                    <h2 class="no_content_message">Még nem követsz chatszobát.</h2>
                `);
            } else {
                followedChatrooms.forEach(chatroom => {
                    chatroomSection.insertAdjacentHTML('beforeend', `
                        <div class="content_container chatroom_container followed_chatroom_container" data-room-id="${escapeHtml(chatroom.room_id)}">
                            <a href="chatroom.php?room_id=${escapeHtml(chatroom.room_id)}" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                            <button class="button small_button content_unfollow_button" aria-label="Követés megszüntetése">
                                <span class="icon_text">Követés megszüntetése</span>
                                <img src="icons/unfollow.svg" alt="Követés megszüntetése">
                            </button>
                            <h2>${escapeHtml(chatroom.title)}</h2>
                            <p>${escapeHtml(chatroom.description)}</p>
                            <p>${escapeHtml(chatroom.creater_nickname)}${chatroom.create_date ? ', ' + escapeHtml(chatroom.create_date) : ''}, ${escapeHtml(chatroom.class_name)}</p>
                        </div>
                    `);
                });
            }
        } catch (error) {
            console.error('Hiba történt a chatszobák betöltésekor:', error);
            chatroomSection.innerHTML = '<h2 class="no_content_message">Hiba történt a chatszobák betöltésekor.</h2>';
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
    async function generateSubjectFiles() {
        const fileSection = document.getElementById('subject_file_container');
        if (!fileSection) return;
        fileSection.innerHTML = '';

        // Tárgy kód lekérése az URL-ből
        const urlParams = new URLSearchParams(window.location.search);
        const classCode = urlParams.get('class_code');

        if (!classCode) {
            fileSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiányzó tárgy azonosító.</h2>'
            );
            return;
        }

        try {
            const response = await fetch(`php/getFiles.php?mode=class&class_code=${encodeURIComponent(classCode)}`);
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a fájlokat.');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Ismeretlen hiba');
            }
            
            const files = result.files;
            
            if (files.length === 0) {
                fileSection.insertAdjacentHTML('beforeend', 
                    '<h2 class="no_content_message">Még nincsenek feltöltött fájlok ehhez a tárgyhoz.</h2>'
                );
            } else {
                files.forEach(file => {
                    if (file.is_own) {
                        fileSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container uploaded_files_container">
                                <a href="#" class="container_link own_details_link" data-up-id="${file.up_id}" aria-label="Fájl részletei"></a>
                                <button class="button small_button content_download_button" aria-label="Letöltés">
                                    <span class="icon_text">Letöltés</span>
                                    <img src="icons/download.svg" alt="Letöltés">
                                </button>
                                <div class="content_downloads">
                                    <span>${file.downloads}<span class="hideable_text"> letöltés</span></span>
                                    <img src="icons/download.svg" alt="Letöltések">
                                </div>
                                <div class="content_voting voting_container hideable_content">
                                    <span class="vote_count">${file.rating}</span>
                                    <img class="own_downvote_icon" src="icons/downvote.svg" alt="Nem tetszik">
                                    <img src="icons/upvote.svg" alt="Tetszik">
                                </div>
                                <h2>${file.title}</h2>
                                <p>${file.description}</p>
                                <p>Én, ${file.upload_date}</p>
                            </div>
                        `);
                    } else {
                        fileSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container uploaded_files_container">
                                <a href="#" class="container_link file_details_link" data-up-id="${file.up_id}" aria-label="Fájl részletei"></a>
                                <button class="button small_button content_download_button" aria-label="Letöltés">
                                    <span class="icon_text">Letöltés</span>
                                    <img src="icons/download.svg" alt="Letöltés">
                                </button>
                                <div class="content_downloads">
                                    <span>${file.downloads}<span class="hideable_text"> letöltés</span></span>
                                    <img src="icons/download.svg" alt="Letöltések">
                                </div>
                                <div class="content_voting voting_container hideable_content">
                                    <span class="vote_count">${file.rating}</span>
                                    <button class="button small_button content_downvote_button downvote_button" aria-label="Nem tetszik">
                                        <img src="icons/downvote.svg" alt="Nem tetszik">
                                    </button>  
                                    <button class="button small_button content_upvote_button upvote_button" aria-label="Tetszik">
                                        <img src="icons/upvote.svg" alt="Tetszik">
                                    </button>  
                                </div>
                                <h2>${file.title}</h2>
                                <p>${file.description}</p>
                                <p>${file.uploader_nickname}, ${file.upload_date}</p>
                            </div>
                        `);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading files:', error);
            fileSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiba történt a fájlok betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('subject.php')) {
        generateSubjectFiles();
    }

    // Subject kérelmek generálása
    async function generateSubjectRequests() {
        const requestSection = document.getElementById('subject_request_container');
        if (!requestSection) return;
        requestSection.innerHTML = '';

        // Tárgy kód lekérése az URL-ből
        const urlParams = new URLSearchParams(window.location.search);
        const classCode = urlParams.get('class_code');

        if (!classCode) {
            requestSection.insertAdjacentHTML('beforeend', 
                '<h2 class="no_content_message">Hiányzó tárgy azonosító.</h2>'
            );
            return;
        }

        try {
            const response = await fetch(`php/getRequests.php?mode=class&class_code=${encodeURIComponent(classCode)}`);
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a kérelmeket.');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Hiba történt');
            }
            
            const requests = result.requests;
            
            if (requests.length === 0) {
                requestSection.insertAdjacentHTML('beforeend',
                    '<h2 class="no_content_message">Még nincsenek kérelmek ehhez a tárgyhoz.</h2>'
                );
            } else {
                requests.forEach(request => {
                    if (request.is_own) {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container">
                                <a href="#" class="container_link own_uncompleted_requests_link" data-request-id="${request.request_id}" aria-label="Kérelem megnyitása"></a>
                                <button class="button small_button content_edit_button edit_request_button" aria-label="Szerkesztés">
                                    <span class="icon_text">Szerkesztés</span>
                                    <img src="icons/edit.svg" alt="Szerkesztés">
                                </button>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>${escapeHtml(request.request_name)}</h2>
                                <p>${escapeHtml(request.description)}</p>
                                <p>Én, ${escapeHtml(request.request_date)}</p>
                            </div>
                        `);
                    } else {
                        requestSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container request_container">
                                <a href="#" class="container_link upload_file_button" data-request-id="${request.request_id}" aria-label="Fájl feltöltése"></a>
                                <button class="button small_button content_upload_button upload_file_button" aria-label="Fájl feltöltése">
                                    <span class="icon_text">Fájl feltöltése</span>
                                    <img src="icons/upload.svg" alt="Fájl feltöltése">
                                </button>
                                <button class="button small_button content_report_button report_button" aria-label="Kérelem jelentése">
                                    <span class="icon_text">Jelentés</span>
                                    <img src="icons/report.svg" alt="Kérelem jelentése">
                                </button>
                                <h2>${escapeHtml(request.request_name)}</h2>
                                <p>${escapeHtml(request.description)}</p>
                                <p>${escapeHtml(request.requester_nickname)}, ${escapeHtml(request.request_date)}</p>
                            </div>
                        `);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            requestSection.insertAdjacentHTML('beforeend',
                '<h2 class="no_content_message">Hiba történt a kérelmek betöltésekor.</h2>'
            );
        }
    }
    if (window.location.pathname.includes('subject.php')) {
        generateSubjectRequests();
    }

    // Subject chatszobák generálása
    async function generateSubjectChatrooms() {
        const chatroomSection = document.getElementById('subject_chatszobak');
        if (!chatroomSection) return;

        // Tárgy kód lekérése az URL-ből
        const urlParams = new URLSearchParams(window.location.search);
        const classCode = urlParams.get('class_code');

        if (!classCode) {
            chatroomSection.innerHTML = '<h2 class="no_content_message">Hiányzik a tárgy kód az URL-ből.</h2>';
            return;
        }

        try {
            const response = await fetch(`php/getChatrooms.php?mode=class&class_code=${encodeURIComponent(classCode)}`);
            const data = await response.json();

            if (!data.success) {
                console.error('Hiba a chatszobák betöltésekor:', data.message);
                return;
            }

            if (data.chatrooms.length === 0) {
                chatroomSection.insertAdjacentHTML('beforeend',
                    '<h2 class="no_content_message">Még nincsenek chatszobák ehhez a tárgyhoz.</h2>'
                );
            } else {
                data.chatrooms.forEach(chatroom => {
                    if (chatroom.is_own) {
                        chatroomSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container chatroom_container" data-room-id="${escapeHtml(chatroom.room_id)}">
                                <a href="chatroom.php?room_id=${escapeHtml(chatroom.room_id)}" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                                <button class="button small_button content_edit_button edit_chatroom_button" aria-label="Szerkesztés">
                                    <span class="icon_text">Szerkesztés</span>
                                    <img src="icons/edit.svg" alt="Szerkesztés">
                                </button>
                                <button class="button small_button content_delete_button" aria-label="Törlés">
                                    <span class="icon_text">Törlés</span>
                                    <img src="icons/delete.svg" alt="Törlés">
                                </button>
                                <h2>${escapeHtml(chatroom.title)}</h2>
                                <p>${escapeHtml(chatroom.description)}</p>
                                <p>Én${chatroom.create_date ? ', ' + escapeHtml(chatroom.create_date) : ''}</p>
                            </div>
                        `);
                    } else {
                        const followButtonStyle = chatroom.is_following ? 'display: none;' : '';
                        const unfollowButtonStyle = chatroom.is_following ? '' : 'display: none;';
                        
                        chatroomSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container chatroom_container" data-room-id="${escapeHtml(chatroom.room_id)}">
                                <a href="chatroom.php?room_id=${escapeHtml(chatroom.room_id)}" class="container_link chatroom_link" aria-label="Chatszoba megnyitása"></a>
                                <button class="button small_button content_follow_button" aria-label="Követés" style="${followButtonStyle}">
                                    <span class="icon_text">Követés</span>
                                    <img src="icons/follow.svg" alt="Követés">
                                </button>
                                <button class="button small_button content_unfollow_button" aria-label="Követés megszüntetése" style="${unfollowButtonStyle}">
                                    <span class="icon_text">Követés megszüntetése</span>
                                    <img src="icons/unfollow.svg" alt="Követés megszüntetése">
                                </button>
                                <button class="button small_button content_report_button report_button" aria-label="Chatszoba jelentése">
                                    <span class="icon_text">Jelentés</span>
                                    <img src="icons/report.svg" alt="Chatszoba jelentése">
                                </button>
                                <h2>${escapeHtml(chatroom.title)}</h2>
                                <p>${escapeHtml(chatroom.description)}</p>
                                <p>${escapeHtml(chatroom.creater_nickname)}${chatroom.create_date ? ', ' + escapeHtml(chatroom.create_date) : ''}</p>
                            </div>
                        `);
                    }
                });
            }
        } catch (error) {
            console.error('Hiba történt a chatszobák betöltésekor:', error);
            chatroomSection.innerHTML = '<h2 class="no_content_message">Hiba történt a chatszobák betöltésekor.</h2>';
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
                // AZONNAL beállítjuk a flaget és töröljük a hibákat
                isRegisterFormSwitching = true;
                clearAllRegisterErrors();
                
                // Ezután töröljük az űrlap adatokat és váltunk
                const regForm = document.getElementById('registerForm');
                if (regForm) {
                    regForm.reset();
                }
                
                loginDiv.style.display = 'block';
                registerDiv.style.display = 'none';
                const neptunInput = document.getElementById('loginNeptun');
                if (neptunInput) {
                    neptunInput.focus();
                }
                
                // Flag visszaállítása
                setTimeout(function() {
                    isRegisterFormSwitching = false;
                }, 50);
            }
        }
    });

    // Flag a login form váltás érzékeléséhez (login form blur események letiltására)
    let isLoginFormSwitching = false;
    
    if (showRegisterLink && showLoginLink) {
        // Mousedown-nál már beállítjuk a flaget, hogy a blur ne váltson ki hibát
        showRegisterLink.addEventListener('mousedown', function() {
            isLoginFormSwitching = true;
            clearAllLoginErrors();
        });
        
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Flag már be van állítva a mousedown-nál
            clearAllLoginErrors();
            
            // Töröljük a login form adatokat és váltunk
            if (loginForm) {
                loginForm.reset();
            }
            
            loginDiv.style.display = 'none';
            registerDiv.style.display = 'block';
            const neptunInput = document.getElementById('registerNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
            
            // Flag visszaállítása kis késleltetéssel
            setTimeout(function() {
                isLoginFormSwitching = false;
            }, 100);
        });

        // Mousedown-nál már beállítjuk a flaget, hogy a blur ne váltson ki hibát
        showLoginLink.addEventListener('mousedown', function() {
            isRegisterFormSwitching = true;
            clearAllRegisterErrors();
        });
        
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Flag már be van állítva a mousedown-nál
            clearAllRegisterErrors();
            
            // Töröljük az űrlap adatokat és váltunk
            if (registerForm) {
                registerForm.reset();
            }
            
            registerDiv.style.display = 'none';
            loginDiv.style.display = 'block';
            const neptunInput = document.getElementById('loginNeptun');
            if (neptunInput) {
                neptunInput.focus();
            }
            
            // Flag visszaállítása kis késleltetéssel
            setTimeout(function() {
                isRegisterFormSwitching = false;
            }, 100);
        });
    }

    // Login és regisztráció segédfüggvények
    function showLoginError(field, message, shouldFocus = false) {
        const input = document.getElementById('login' + field.charAt(0).toUpperCase() + field.slice(1));
        const errorSpan = document.getElementById('error_login_' + field);
        
        if (input && errorSpan) {
            input.classList.add('error');
            errorSpan.textContent = message;
            if (shouldFocus) {
                input.focus();
            }
        }
    }
    
    function clearLoginError(field) {
        const input = document.getElementById('login' + field.charAt(0).toUpperCase() + field.slice(1));
        const errorSpan = document.getElementById('error_login_' + field);
        
        if (input && errorSpan) {
            input.classList.remove('error');
            errorSpan.textContent = '';
        }
    }
    
    function clearAllLoginErrors() {
        const fields = ['neptun', 'password'];
        fields.forEach(field => clearLoginError(field));
    }
    
    function showRegisterError(field, message, shouldFocus = false) {
        // Convert field name to camelCase for input ID (e.g., confirm_password -> ConfirmPassword)
        const inputIdSuffix = field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        const input = document.getElementById('register' + inputIdSuffix);
        const errorSpan = document.getElementById('error_register_' + field);
        
        if (input && errorSpan) {
            input.classList.add('error');
            errorSpan.textContent = message;
            if (shouldFocus) {
                input.focus();
            }
        }
    }
    
    function clearRegisterError(field) {
        // Convert field name to camelCase for input ID (e.g., confirm_password -> ConfirmPassword)
        const inputIdSuffix = field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        const input = document.getElementById('register' + inputIdSuffix);
        const errorSpan = document.getElementById('error_register_' + field);
        
        if (input && errorSpan) {
            input.classList.remove('error');
            errorSpan.textContent = '';
        }
    }
    
    function clearAllRegisterErrors() {
        const fields = ['neptun', 'username', 'fullname', 'email', 'password', 'confirm_password'];
        fields.forEach(field => clearRegisterError(field));
    }

    // Validációs minták
    const patterns = {
        neptun: /^[A-Z0-9]{6}$/i,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
    };

    // Login form kezelése
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginNeptun = document.getElementById('loginNeptun');
        const loginPassword = document.getElementById('loginPassword');
        
        // Neptun validáció
        if (loginNeptun) {
            loginNeptun.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.neptun.test(value)) {
                    clearLoginError('neptun');
                }
            });
            
            loginNeptun.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isLoginFormSwitching) return;
                
                const value = this.value.trim();
                if (value === '') {
                    showLoginError('neptun', 'A Neptun kód megadása kötelező!');
                } else if (!patterns.neptun.test(value)) {
                    showLoginError('neptun', 'A Neptun kód 6 alfanumerikus karakterből kell álljon!');
                } else {
                    clearLoginError('neptun');
                }
            });
        }
        
        // Jelszó validáció
        if (loginPassword) {
            loginPassword.addEventListener('input', function() {
                if (this.value !== '') {
                    clearLoginError('password');
                }
            });
            
            loginPassword.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isLoginFormSwitching) return;
                
                if (this.value === '') {
                    showLoginError('password', 'A jelszó megadása kötelező!');
                } else {
                    clearLoginError('password');
                }
            });
        }
        
        // Form submit kezelése AJAX-szal
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearAllLoginErrors();
            
            const neptun = loginNeptun?.value.trim() || '';
            const password = loginPassword?.value || '';
            
            let hasError = false;
            
            // Validáció
            if (neptun === '') {
                showLoginError('neptun', 'A Neptun kód megadása kötelező!', true);
                hasError = true;
            } else if (!patterns.neptun.test(neptun)) {
                showLoginError('neptun', 'A Neptun kód 6 alfanumerikus karakterből kell álljon!', true);
                hasError = true;
            }
            
            if (password === '') {
                showLoginError('password', 'A jelszó megadása kötelező!', !hasError);
                hasError = true;
            }
            
            if (hasError) return;
            
            // AJAX kérés
            try {
                showLoading('Bejelentkezés...');
                
                const response = await fetch('php/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ neptun, password })
                });
                
                const result = await response.json();
                
                
                if (result.success) {
                    setTimeout(() => {
                        hideLoading();
                        // Sikeres bejelentkezés - átirányítás
                        window.location.href = 'dashboard.php';
                    }, 1250);
                } else {
                    setTimeout(() => {
                        hideLoading();
                        // Hiba megjelenítése - mindig a jelszó mező alá
                        if (result.field && result.field !== '') {
                            showLoginError(result.field, result.error, true);
                        } else {
                            // Általános hiba a jelszó mező alatt, input mezők nem lesznek error state-ben
                            const errorSpan = document.getElementById('error_login_password');
                            if (errorSpan) {
                                errorSpan.textContent = result.error || 'Hiba történt a bejelentkezés során!';
                            }
                        }
                    }, 1250);
                }
            } catch (error) {
                hideLoading();
                console.error('Login error:', error);
                alert('Hiba történt a bejelentkezés során!');
            }
        });
    }

    // Regisztráció form kezelése
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Valós idejű validáció
        const registerNeptun = document.getElementById('registerNeptun');
        const registerUsername = document.getElementById('registerUsername');
        const registerFullname = document.getElementById('registerFullname');
        const registerEmail = document.getElementById('registerEmail');
        const registerPassword = document.getElementById('registerPassword');
        const registerConfirmPassword = document.getElementById('registerConfirmPassword');
        
        // Neptun validáció
        if (registerNeptun) {
            registerNeptun.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.neptun.test(value)) {
                    clearRegisterError('neptun');
                }
            });
            
            registerNeptun.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value.trim();
                if (value === '') {
                    showRegisterError('neptun', 'A Neptun kód megadása kötelező!');
                } else if (!patterns.neptun.test(value)) {
                    showRegisterError('neptun', 'A Neptun kód 6 alfanumerikus karakterből kell álljon!');
                } else {
                    clearRegisterError('neptun');
                }
            });
        }
        
        // Felhasználónév validáció
        if (registerUsername) {
            registerUsername.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.username.test(value)) {
                    clearRegisterError('username');
                }
            });
            
            registerUsername.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value.trim();
                if (value === '') {
                    showRegisterError('username', 'A felhasználónév megadása kötelező!');
                } else if (!patterns.username.test(value)) {
                    showRegisterError('username', '3-20 karakter, csak betűk, számok és aláhúzás!');
                } else {
                    clearRegisterError('username');
                }
            });
        }
        
        // Teljes név validáció
        if (registerFullname) {
            registerFullname.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.fullname.test(value)) {
                    clearRegisterError('fullname');
                }
            });
            
            registerFullname.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value.trim();
                if (value === '') {
                    showRegisterError('fullname', 'A teljes név megadása kötelező!');
                } else if (!patterns.fullname.test(value)) {
                    showRegisterError('fullname', 'Vezetéknév és legalább egy keresztnév szükséges!');
                } else {
                    clearRegisterError('fullname');
                }
            });
        }
        
        // Email validáció
        if (registerEmail) {
            registerEmail.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.email.test(value)) {
                    clearRegisterError('email');
                }
            });
            
            registerEmail.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value.trim();
                if (value === '') {
                    showRegisterError('email', 'Az email cím megadása kötelező!');
                } else if (!patterns.email.test(value)) {
                    showRegisterError('email', 'Érvénytelen email formátum!');
                } else {
                    clearRegisterError('email');
                }
            });
        }
        
        // Jelszó validáció
        if (registerPassword) {
            registerPassword.addEventListener('input', function() {
                const value = this.value;
                if (value !== '' && patterns.password.test(value)) {
                    clearRegisterError('password');
                }
            });
            
            registerPassword.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value;
                if (value === '') {
                    showRegisterError('password', 'A jelszó megadása kötelező!');
                } else if (!patterns.password.test(value)) {
                    showRegisterError('password', 'Legalább 8 karakter, 1 nagybetű és 1 szám!');
                } else {
                    clearRegisterError('password');
                }
            });
        }
        
        // Jelszó megerősítés validáció
        if (registerConfirmPassword) {
            registerConfirmPassword.addEventListener('input', function() {
                const value = this.value;
                const password = registerPassword?.value || '';
                
                // Ha üres, ne mutassunk hibát (majd blur fogja)
                if (value === '') {
                    clearRegisterError('confirm_password');
                } else if (value === password) {
                    // Ha egyezik, töröljük a hibát
                    clearRegisterError('confirm_password');
                } else {
                    // Ha nem egyezik, mutassuk a hibát
                    showRegisterError('confirm_password', 'A két jelszó nem egyezik!');
                }
            });
            
            registerConfirmPassword.addEventListener('blur', function() {
                // Ne mutassunk hibát, ha form váltás közben vagyunk
                if (isRegisterFormSwitching) return;
                
                const value = this.value;
                const password = registerPassword?.value || '';
                if (value === '') {
                    showRegisterError('confirm_password', 'A jelszó megerősítése kötelező!');
                } else if (value !== password) {
                    showRegisterError('confirm_password', 'A két jelszó nem egyezik!');
                } else {
                    clearRegisterError('confirm_password');
                }
            });
        }
        
        // Form submit kezelése AJAX-szal
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearAllRegisterErrors();
            
            const neptun = registerNeptun?.value.trim() || '';
            const username = registerUsername?.value.trim() || '';
            const fullname = registerFullname?.value.trim() || '';
            const email = registerEmail?.value.trim() || '';
            const password = registerPassword?.value || '';
            const confirmPassword = registerConfirmPassword?.value || '';
            
            let hasError = false;
            let firstErrorField = null;
            
            // Validáció
            if (neptun === '') {
                showRegisterError('neptun', 'A Neptun kód megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'neptun';
                hasError = true;
            } else if (!patterns.neptun.test(neptun)) {
                showRegisterError('neptun', 'A Neptun kód 6 alfanumerikus karakterből kell álljon!');
                if (!firstErrorField) firstErrorField = 'neptun';
                hasError = true;
            }
            
            if (username === '') {
                showRegisterError('username', 'A felhasználónév megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'username';
                hasError = true;
            } else if (!patterns.username.test(username)) {
                showRegisterError('username', '3-20 karakter, csak betűk, számok és aláhúzás!');
                if (!firstErrorField) firstErrorField = 'username';
                hasError = true;
            }
            
            if (fullname === '') {
                showRegisterError('fullname', 'A teljes név megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'fullname';
                hasError = true;
            } else if (!patterns.fullname.test(fullname)) {
                showRegisterError('fullname', 'Vezetéknév és legalább egy keresztnév szükséges!');
                if (!firstErrorField) firstErrorField = 'fullname';
                hasError = true;
            }
            
            if (email === '') {
                showRegisterError('email', 'Az email cím megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'email';
                hasError = true;
            } else if (!patterns.email.test(email)) {
                showRegisterError('email', 'Érvénytelen email formátum!');
                if (!firstErrorField) firstErrorField = 'email';
                hasError = true;
            }
            
            if (password === '') {
                showRegisterError('password', 'A jelszó megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'password';
                hasError = true;
            } else if (!patterns.password.test(password)) {
                showRegisterError('password', 'Legalább 8 karakter, 1 nagybetű és 1 szám!');
                if (!firstErrorField) firstErrorField = 'password';
                hasError = true;
            }
            
            if (confirmPassword === '') {
                showRegisterError('confirm_password', 'A jelszó megerősítése kötelező!');
                if (!firstErrorField) firstErrorField = 'confirm_password';
                hasError = true;
            } else if (password !== confirmPassword) {
                showRegisterError('confirm_password', 'A két jelszó nem egyezik!');
                if (!firstErrorField) firstErrorField = 'confirm_password';
                hasError = true;
            }
            
            if (hasError) {
                if (firstErrorField) {
                    // Convert field name to camelCase for input ID (e.g., confirm_password -> ConfirmPassword)
                    const inputIdSuffix = firstErrorField.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                    const firstInput = document.getElementById('register' + inputIdSuffix);
                    if (firstInput) firstInput.focus();
                }
                return;
            }
            
            // AJAX kérés
            try {
                showLoading('Regisztráció...');
                
                const response = await fetch('php/registration.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        neptun, 
                        username, 
                        fullname, 
                        email, 
                        password, 
                        confirm_password: confirmPassword 
                    })
                });
                
                const result = await response.json();
                
                setTimeout(() => {
                    hideLoading();
                    if (result.success) {
                    // Sikeres regisztráció
                    alert(result.message || 'Sikeres regisztráció!');
                    
                    // Űrlap törlése
                    registerForm.reset();
                    clearAllRegisterErrors();
                    
                    // Átváltás bejelentkezésre
                    const loginDiv = document.getElementById('login');
                    const registerDiv = document.getElementById('register');
                    if (loginDiv && registerDiv) {
                        registerDiv.style.display = 'none';
                        loginDiv.style.display = 'block';
                        window.location.hash = '';
                        
                        // Neptun kód előtöltése a login formba
                        const loginNeptunInput = document.getElementById('loginNeptun');
                        if (loginNeptunInput) {
                            loginNeptunInput.value = neptun;
                            loginNeptunInput.focus();
                        }
                    }
                    } else {
                        // Hiba megjelenítése
                        if (result.field) {
                            showRegisterError(result.field, result.error, true);
                        } else {
                            alert(result.error || 'Hiba történt a regisztráció során!');
                        }
                    }
                }, 1250);

                
            } catch (error) {
                hideLoading();
                console.error('Registration error:', error);
                alert('Hiba történt a regisztráció során!');
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
        const header = document.querySelector('header');
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                if (header) header.classList.toggle('menu-open');
            });
            document.addEventListener('click', function(e) {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (header) header.classList.remove('menu-open');
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

            // Kérelem keresés törlése szekció váltáskor
            const requestSearchInput = document.getElementById('request_search_input');
            if (requestSearchInput) {
                requestSearchInput.value = '';
                requestSearchInput.dispatchEvent(new Event('input'));
            }

            // Chatszoba keresés törlése szekció váltáskor
            const chatroomSearchInput = document.getElementById('chatroom_search_input');
            if (chatroomSearchInput) {
                chatroomSearchInput.value = '';
                chatroomSearchInput.dispatchEvent(new Event('input'));
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
                        const header = document.querySelector('header');
                        if (header) header.classList.remove('menu-open');
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
                    
                    // Admin modal keresés visszaállítása
                    if (searchInput.classList.contains('admin_search_input')) {
                        const containers = modal.querySelectorAll('.admin_container');
                        containers.forEach(function(container) {
                            container.style.display = '';
                        });
                    } else {
                        // Egyéb keresések esetén az input event kiváltása
                        searchInput.dispatchEvent(new Event('input'));
                    }
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
    const allCloseButtons = document.querySelectorAll('.modal_close_button, .edit_close_button, .upload_close_button, .request_close_button, .report_close_button, .chatroom_close_button, .add_close_button');
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
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.add_request_button');
        if (button) {
            e.preventDefault();
            const addRequestModal = document.querySelector('.add_request_modal');
            if (addRequestModal) {
                addRequestModal.classList.remove('hidden');
            }
        }
    });

    // Új chatszoba modal megnyitása
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.add_chatroom_button');
        if (button) {
            e.preventDefault();
            const addChatroomModal = document.querySelector('.add_chatroom_modal');
            if (addChatroomModal) {
                addChatroomModal.classList.remove('hidden');
            }
        }
    });

    // Fájl feltöltés modal megnyitása
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.upload_file_button');
        if (button) {
            e.preventDefault();
            const uploadFileModal = document.querySelector('.upload_file_modal');
            if (uploadFileModal) {
                uploadFileModal.classList.remove('hidden');
            }
        }
    });

    // Jelentés modal megnyitása
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.report_button');
        if (button) {
            e.preventDefault();
            const reportModal = document.querySelector('.report_content_modal');
            if (reportModal) {
                reportModal.classList.remove('hidden');
            }
        }
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
                const response = await fetch(`php/getFileDetails.php?mode=upload&id=${upId}`);
                
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
                    // Modal gombokhoz id beállítása
                    fileDetailsModal.setAttribute('data-up-id', data.up_id);
                    
                    // Adatok beállítása a modalban
                    const titleElement = fileDetailsModal.querySelector('.data-file-title');
                    const uploaderElement = fileDetailsModal.querySelector('.data-file-uploader');
                    const fileNameElement = fileDetailsModal.querySelector('.data-file-name');
                    const dateElement = fileDetailsModal.querySelector('.data-file-date');
                    const downloadsElement = fileDetailsModal.querySelector('.data-file-downloads');
                    const ratingElement = fileDetailsModal.querySelector('.data-file-rating');
                    const descriptionElement = fileDetailsModal.querySelector('.data-file-description');
                    
                    if (titleElement) titleElement.textContent = data.title;
                    if (uploaderElement) uploaderElement.textContent = data.uploader;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
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
                const response = await fetch(`php/getFileDetails.php?mode=upload&id=${upId}`);
                
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
                    // Modal gombokhoz id beállítása
                    ownFileModal.setAttribute('data-up-id', data.up_id);
                    
                    // Adatok beállítása a modalban
                    const titleElement = ownFileModal.querySelector('.data-file-title');
                    const fileNameElement = ownFileModal.querySelector('.data-file-name');
                    const subjectElement = ownFileModal.querySelector('.data-file-subject');
                    const dateElement = ownFileModal.querySelector('.data-file-date');
                    const downloadsElement = ownFileModal.querySelector('.data-file-downloads');
                    const ratingElement = ownFileModal.querySelector('.data-file-rating');
                    const descriptionElement = ownFileModal.querySelector('.data-file-description');
                    
                    if (titleElement) titleElement.textContent = data.title;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (subjectElement) subjectElement.textContent = data.class_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
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
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.own_uncompleted_requests_link');
        if (link) {
            e.preventDefault();
            const requestId = link.getAttribute('data-request-id');
            
            if (!requestId) {
                alert('Hiányzó kérelem azonosító');
                return;
            }
            
            // Kérelem kártya megkeresése
            // Dashboard: .own_uncompleted_request_container, Subject: .request_container
            const requestContainer = link.closest('.own_uncompleted_request_container, .request_container');
            if (!requestContainer) {
                alert('Nem sikerült betölteni a kérelem adatait');
                return;
            }
            
            // Adatok kinyerése a kártyából
            const title = requestContainer.querySelector('h2')?.textContent || '';
            const paragraphs = requestContainer.querySelectorAll('p');
            const description = paragraphs[0]?.textContent || '';
            const dateAndSubject = paragraphs[1]?.textContent || '';
            
            // Dátum és tárgy szétválasztása
            // Dashboard formátum: "2025-01-01, Tárgy neve"
            // Subject formátum: "Én, 2025-01-01"
            let date = '';
            let subject = '';
            
            if (dateAndSubject.startsWith('Én, ')) {
                // Subject.php formátum: "Én, 2025-01-01"
                date = dateAndSubject.replace('Én, ', '').trim();
                // Subject oldalon a tárgy neve a h1 elemben van
                const h1Element = document.querySelector('h1');
                subject = h1Element ? h1Element.textContent.trim() : 'Nincs megadva';
            } else {
                // Dashboard formátum: "2025-01-01, Tárgy neve"
                [date, subject] = dateAndSubject.split(', ').map(s => s.trim());
            }
            
            const ownUncompletedRequestsModal = document.querySelector('.own_uncompleted_requests_modal');
            
            if (ownUncompletedRequestsModal) {
                // Modal gombokhoz id beállítása
                ownUncompletedRequestsModal.setAttribute('data-request-id', requestId);
                
                // Adatok beállítása a modalban
                const titleElement = ownUncompletedRequestsModal.querySelector('.data-request-title');
                const subjectElement = ownUncompletedRequestsModal.querySelector('.data-request-subject');
                const dateElement = ownUncompletedRequestsModal.querySelector('.data-request-date');
                const descriptionElement = ownUncompletedRequestsModal.querySelector('.data-request-description');
                
                if (titleElement) titleElement.textContent = title;
                if (subjectElement) subjectElement.textContent = subject || 'Nincs megadva';
                if (dateElement) dateElement.textContent = date || 'Nincs megadva';
                if (descriptionElement) descriptionElement.textContent = description;
                
                // Modal megjelenítése
                ownUncompletedRequestsModal.classList.remove('hidden');
            }
        }
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
                const response = await fetch(`php/getFileDetails.php?mode=request&id=${requestId}`);
                
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
                    // Modal gombokhoz id-k beállítása
                    ownCompletedRequestsModal.setAttribute('data-up-id', data.up_id);
                    ownCompletedRequestsModal.setAttribute('data-request-id', data.request_id);
                    
                    // Adatok beállítása a modalban
                    const requestTitleElement = ownCompletedRequestsModal.querySelector('.data-request-title');
                    const fileTitleElement = ownCompletedRequestsModal.querySelector('.data-file-title');
                    const uploaderElement = ownCompletedRequestsModal.querySelector('.data-file-uploader');
                    const fileNameElement = ownCompletedRequestsModal.querySelector('.data-file-name');
                    const subjectElement = ownCompletedRequestsModal.querySelector('.data-file-subject');
                    const dateElement = ownCompletedRequestsModal.querySelector('.data-file-date');
                    const downloadsElement = ownCompletedRequestsModal.querySelector('.data-file-downloads');
                    const ratingElement = ownCompletedRequestsModal.querySelector('.data-file-rating');
                    const descriptionElement = ownCompletedRequestsModal.querySelector('.data-file-description');
                    
                    if (requestTitleElement) requestTitleElement.textContent = data.request_name;
                    if (fileTitleElement) fileTitleElement.textContent = data.title;
                    if (uploaderElement) uploaderElement.textContent = data.uploader;
                    if (fileNameElement) fileNameElement.textContent = data.file_name;
                    if (subjectElement) subjectElement.textContent = data.class_name;
                    if (dateElement) dateElement.textContent = data.upload_date;
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
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.edit_file_button');
        if (button) {
            e.preventDefault();
            const editFileModal = document.querySelector('.edit_file_modal');
            if (editFileModal) {
                editFileModal.classList.remove('hidden');
            }
        }
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
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.edit_request_button');
        if (button) {
            e.preventDefault();
            
            let requestId = null;
            let title = '';
            let description = '';
            
            // Ellenőrizzük, hogy a részletek modalból vagy a kártyából nyitjuk meg
            const parentModal = button.closest('.own_uncompleted_requests_modal');
            
            if (parentModal) {
                // Modalból nyitjuk meg - adatok a modalból
                requestId = parentModal.getAttribute('data-request-id');
                const titleElement = parentModal.querySelector('.data-request-title');
                const descriptionElement = parentModal.querySelector('.data-request-description');
                
                title = titleElement?.textContent || '';
                description = descriptionElement?.textContent || '';
            } else {
                // Kártyából nyitjuk meg - keressük meg a kártya elemet
                // Dashboard: .own_uncompleted_request_container, Subject: .request_container
                const requestContainer = button.closest('.own_uncompleted_request_container, .request_container');
                if (requestContainer) {
                    const link = requestContainer.querySelector('.own_uncompleted_requests_link');
                    requestId = link?.getAttribute('data-request-id');
                    
                    title = requestContainer.querySelector('h2')?.textContent || '';
                    const paragraphs = requestContainer.querySelectorAll('p');
                    description = paragraphs[0]?.textContent || '';
                }
            }
            
            if (!requestId) {
                alert('Hiányzó kérelem azonosító');
                return;
            }
            
            const editRequestModal = document.querySelector('.edit_request_modal');
            if (editRequestModal) {
                // Modal azonosító beállítása
                editRequestModal.setAttribute('data-request-id', requestId);
                
                // Input mezők kitöltése
                const titleInput = document.getElementById('requestTitle');
                const descriptionInput = document.getElementById('requestDescription');
                
                if (titleInput) titleInput.value = title;
                if (descriptionInput) descriptionInput.value = description;
                
                // Modal megjelenítése
                editRequestModal.classList.remove('hidden');
            }
        }
    });

    // Chatszoba szerkesztés modal megnyitása
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.edit_chatroom_button');
        if (button) {
            e.preventDefault();
            
            // Chatszoba kártya megkeresése
            // Dashboard: .own_chatroom_container, Subject: .chatroom_container
            const chatroomContainer = button.closest('.own_chatroom_container, .chatroom_container');
            if (!chatroomContainer) {
                alert('Nem sikerült betölteni a chatszoba adatait');
                return;
            }
            
            // Adatok kinyerése a kártyából
            const roomId = chatroomContainer.getAttribute('data-room-id');
            const title = chatroomContainer.querySelector('h2')?.textContent || '';
            const paragraphs = chatroomContainer.querySelectorAll('p');
            const description = paragraphs[0]?.textContent || '';
            
            if (!roomId) {
                alert('Hiányzó chatszoba azonosító');
                return;
            }
            
            const editChatroomModal = document.querySelector('.edit_chatroom_modal');
            if (editChatroomModal) {
                // Modal azonosító beállítása
                editChatroomModal.setAttribute('data-room-id', roomId);
                
                // Input mezők kitöltése
                const titleInput = document.getElementById('chatroomTitle');
                const descriptionInput = document.getElementById('chatroomDescription');
                
                if (titleInput) titleInput.value = title;
                if (descriptionInput) descriptionInput.value = description;
                
                // Modal megjelenítése
                editChatroomModal.classList.remove('hidden');
            }
        }
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
    
    // Segédfüggvény hibaüzenet megjelenítéséhez
    function showError(inputId, message, shouldFocus = false) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById('error_' + inputId.replace('profile_', ''));
        
        if (input && errorSpan) {
            input.classList.add('error');
            errorSpan.textContent = message;
            if (shouldFocus) {
                input.focus();
            }
        }
    }
    
    // Segédfüggvény hibaüzenet eltávolításához
    function clearError(inputId) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById('error_' + inputId.replace('profile_', ''));
        
        if (input && errorSpan) {
            input.classList.remove('error');
            errorSpan.textContent = '';
        }
    }
    
    // Segédfüggvény az összes hiba törlésére
    function clearAllErrors() {
        const allInputs = ['profile_neptun', 'profile_username', 'profile_fullname', 'profile_email', 
                           'profile_current_password', 'profile_new_password', 'profile_repeat_password'];
        allInputs.forEach(inputId => clearError(inputId));
    }
    
    // Profil szerkesztés mód bekapcsolása
    if (editProfileButton) {
        editProfileButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearAllErrors();
            
            profileInputs.forEach(function(input) {
                if (input) {
                    input.removeAttribute('readonly');
                }
            });
            if (passwordFields) {
                passwordFields.style.display = 'block';
            }
            editProfileButton.style.display = 'none';
            if (profileEditButtons) {
                profileEditButtons.style.display = 'flex';
            }
            
            // Valós idejű validáció hozzáadása
            setupProfileValidation();
        });
    }
    
    // Profil szerkesztés megszakítása
    if (cancelProfileButton) {
        cancelProfileButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearAllErrors();
            
            profileInputs.forEach(function(input) {
                if (input) {
                    input.setAttribute('readonly', 'readonly');
                }
            });
            if (passwordFields) {
                passwordFields.style.display = 'none';
                // Jelszó mezők törlése
                const pwdInputs = ['profile_current_password', 'profile_new_password', 'profile_repeat_password'];
                pwdInputs.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.value = '';
                });
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
    
    // Valós idejű validáció beállítása
    function setupProfileValidation() {
        const neptunInput = document.getElementById('profile_neptun');
        const usernameInput = document.getElementById('profile_username');
        const fullnameInput = document.getElementById('profile_fullname');
        const emailInput = document.getElementById('profile_email');
        const currentPasswordInput = document.getElementById('profile_current_password');
        const newPasswordInput = document.getElementById('profile_new_password');
        const repeatPasswordInput = document.getElementById('profile_repeat_password');
        
        // Érvényesítési minták
        const patterns = {
            neptun: /^[A-Z0-9]{6}$/i,
            username: /^[a-zA-Z0-9_]{3,20}$/,
            fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
        };
        
        // Neptun kód validálás
        if (neptunInput) {
            neptunInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value === '') {
                    showError('profile_neptun', 'A Neptun kód megadása kötelező!');
                } else if (!patterns.neptun.test(value)) {
                    showError('profile_neptun', 'A Neptun kód pontosan 6 alfanumerikus karakter kell legyen!');
                } else {
                    clearError('profile_neptun');
                }
            });
            
            neptunInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.neptun.test(value)) {
                    clearError('profile_neptun');
                }
            });
        }
        
        // Felhasználónév validálás
        if (usernameInput) {
            usernameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value === '') {
                    showError('profile_username', 'A felhasználónév megadása kötelező!');
                } else if (!patterns.username.test(value)) {
                    showError('profile_username', '3-20 karakter, csak betűk, számok és aláhúzás!');
                } else {
                    clearError('profile_username');
                }
            });
            
            usernameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.username.test(value)) {
                    clearError('profile_username');
                }
            });
        }
        
        // Teljes név validálás
        if (fullnameInput) {
            fullnameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value === '') {
                    showError('profile_fullname', 'A teljes név megadása kötelező!');
                } else if (!patterns.fullname.test(value)) {
                    showError('profile_fullname', 'Vezetéknév és legalább egy keresztnév szükséges!');
                } else {
                    clearError('profile_fullname');
                }
            });
            
            fullnameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.fullname.test(value)) {
                    clearError('profile_fullname');
                }
            });
        }
        
        // Email validálás
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value === '') {
                    showError('profile_email', 'Az email cím megadása kötelező!');
                } else if (!patterns.email.test(value)) {
                    showError('profile_email', 'Érvénytelen email formátum!');
                } else {
                    clearError('profile_email');
                }
            });
            
            emailInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value !== '' && patterns.email.test(value)) {
                    clearError('profile_email');
                }
            });
        }
        
        // Jelszó mezők kezelése - ha az egyik ki van töltve, a többit is kötelezővé tesszük
        const passwordInputs = [currentPasswordInput, newPasswordInput, repeatPasswordInput];
        
        passwordInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', function() {
                    const anyFilled = passwordInputs.some(inp => inp && inp.value.trim() !== '');
                    
                    if (anyFilled) {
                        // Ha bármelyik jelszó mező ki van töltve, jelezzük a többit is
                        if (currentPasswordInput && currentPasswordInput.value.trim() === '') {
                            showError('profile_current_password', 'A jelenlegi jelszó megadása kötelező!');
                        } else {
                            clearError('profile_current_password');
                        }
                        
                        if (newPasswordInput && newPasswordInput.value.trim() === '') {
                            showError('profile_new_password', 'Az új jelszó megadása kötelező!');
                        } else if (newPasswordInput && newPasswordInput.value.trim() !== '') {
                            clearError('profile_new_password');
                        }
                        
                        if (repeatPasswordInput && repeatPasswordInput.value.trim() === '') {
                            showError('profile_repeat_password', 'Az új jelszó megerősítése kötelező!');
                        } else if (repeatPasswordInput && repeatPasswordInput.value.trim() !== '') {
                            clearError('profile_repeat_password');
                        }
                    } else {
                        // Ha mindegyik üres, töröljük a hibákat
                        clearError('profile_current_password');
                        clearError('profile_new_password');
                        clearError('profile_repeat_password');
                    }
                });
            }
        });
        
        // Új jelszó validálás
        if (newPasswordInput) {
            newPasswordInput.addEventListener('blur', function() {
                const value = this.value.trim();
                const anyFilled = passwordInputs.some(inp => inp && inp.value.trim() !== '');
                
                if (anyFilled) {
                    if (value === '') {
                        showError('profile_new_password', 'Az új jelszó megadása kötelező!');
                    } else if (!patterns.password.test(value)) {
                        showError('profile_new_password', 'Legalább 8 karakter, 1 nagybetű és 1 szám!');
                    } else {
                        clearError('profile_new_password');
                    }
                }
            });
        }
        
        // Jelszó megerősítés validálás
        if (repeatPasswordInput) {
            repeatPasswordInput.addEventListener('blur', function() {
                const value = this.value.trim();
                const newPwd = newPasswordInput ? newPasswordInput.value.trim() : '';
                const anyFilled = passwordInputs.some(inp => inp && inp.value.trim() !== '');
                
                if (anyFilled) {
                    if (value === '') {
                        showError('profile_repeat_password', 'Az új jelszó megerősítése kötelező!');
                    } else if (value !== newPwd) {
                        showError('profile_repeat_password', 'A két jelszó nem egyezik!');
                    } else {
                        clearError('profile_repeat_password');
                    }
                }
            });
            
            repeatPasswordInput.addEventListener('input', function() {
                const value = this.value.trim();
                const newPwd = newPasswordInput ? newPasswordInput.value.trim() : '';
                
                if (value !== '' && value === newPwd) {
                    clearError('profile_repeat_password');
                }
            });
        }
    }

    // Profil frissítés
    const profileForm = document.getElementById('profile_form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearAllErrors();
            
            const neptunInput = document.getElementById('profile_neptun');
            const usernameInput = document.getElementById('profile_username');
            const fullnameInput = document.getElementById('profile_fullname');
            const emailInput = document.getElementById('profile_email');
            const currentPasswordInput = document.getElementById('profile_current_password');
            const newPasswordInput = document.getElementById('profile_new_password');
            const repeatPasswordInput = document.getElementById('profile_repeat_password');
            
            const neptun = neptunInput?.value.trim() || '';
            const username = usernameInput?.value.trim() || '';
            const fullname = fullnameInput?.value.trim() || '';
            const email = emailInput?.value.trim() || '';
            const currentPassword = currentPasswordInput?.value || '';
            const newPassword = newPasswordInput?.value || '';
            const repeatPassword = repeatPasswordInput?.value || '';
            
            // Érvényesítési minták
            const patterns = {
                neptun: /^[A-Z0-9]{6}$/i,
                username: /^[a-zA-Z0-9_]{3,20}$/,
                fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
            };
            
            // Validáció hibák gyűjtése
            let hasError = false;
            let firstErrorField = null;
            
            // Neptun kód validálás
            if (neptun === '') {
                showError('profile_neptun', 'A Neptun kód megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'profile_neptun';
                hasError = true;
            } else if (!patterns.neptun.test(neptun)) {
                showError('profile_neptun', 'A Neptun kód pontosan 6 alfanumerikus karakter kell legyen!');
                if (!firstErrorField) firstErrorField = 'profile_neptun';
                hasError = true;
            }
            
            // Felhasználónév validálás
            if (username === '') {
                showError('profile_username', 'A felhasználónév megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'profile_username';
                hasError = true;
            } else if (!patterns.username.test(username)) {
                showError('profile_username', '3-20 karakter, csak betűk, számok és aláhúzás!');
                if (!firstErrorField) firstErrorField = 'profile_username';
                hasError = true;
            }
            
            // Teljes név validálás
            if (fullname === '') {
                showError('profile_fullname', 'A teljes név megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'profile_fullname';
                hasError = true;
            } else if (!patterns.fullname.test(fullname)) {
                showError('profile_fullname', 'Vezetéknév és legalább egy keresztnév szükséges!');
                if (!firstErrorField) firstErrorField = 'profile_fullname';
                hasError = true;
            }
            
            // Email validálás
            if (email === '') {
                showError('profile_email', 'Az email cím megadása kötelező!');
                if (!firstErrorField) firstErrorField = 'profile_email';
                hasError = true;
            } else if (!patterns.email.test(email)) {
                showError('profile_email', 'Érvénytelen email formátum!');
                if (!firstErrorField) firstErrorField = 'profile_email';
                hasError = true;
            }
            
            // Jelszó validálás - csak ha bármelyik jelszó mező ki van töltve
            if (currentPassword || newPassword || repeatPassword) {
                if (!currentPassword) {
                    showError('profile_current_password', 'A jelenlegi jelszó megadása kötelező!');
                    if (!firstErrorField) firstErrorField = 'profile_current_password';
                    hasError = true;
                }
                
                if (!newPassword) {
                    showError('profile_new_password', 'Az új jelszó megadása kötelező!');
                    if (!firstErrorField) firstErrorField = 'profile_new_password';
                    hasError = true;
                } else if (!patterns.password.test(newPassword)) {
                    showError('profile_new_password', 'Legalább 8 karakter, 1 nagybetű és 1 szám!');
                    if (!firstErrorField) firstErrorField = 'profile_new_password';
                    hasError = true;
                }
                
                if (!repeatPassword) {
                    showError('profile_repeat_password', 'Az új jelszó megerősítése kötelező!');
                    if (!firstErrorField) firstErrorField = 'profile_repeat_password';
                    hasError = true;
                } else if (newPassword !== repeatPassword) {
                    showError('profile_repeat_password', 'A két jelszó nem egyezik!');
                    if (!firstErrorField) firstErrorField = 'profile_repeat_password';
                    hasError = true;
                }
            }
            
            // Ha van hiba, fókuszáljuk az első hibás mezőt és ne küldjük el az űrlapot
            if (hasError) {
                if (firstErrorField) {
                    const firstInput = document.getElementById(firstErrorField);
                    if (firstInput) firstInput.focus();
                }
                return;
            }
            
            // Küldendő adatok előkészítése
            const data = {
                neptun: neptun,
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
                    clearAllErrors();
                    
                    profileInputs.forEach(function(input) {
                        if (input) {
                            input.setAttribute('readonly', 'readonly');
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
                    // Backend validációs hibák kezelése
                    const errorMsg = result.error || 'Hiba történt a profil frissítése során!';
                    
                    // Próbáljuk meg felismerni, melyik mezőhöz tartozik a hiba
                    if (errorMsg.toLowerCase().includes('neptun')) {
                        showError('profile_neptun', errorMsg, true);
                    } else if (errorMsg.toLowerCase().includes('email')) {
                        showError('profile_email', errorMsg, true);
                    } else if (errorMsg.toLowerCase().includes('felhasználónév') || errorMsg.toLowerCase().includes('username')) {
                        showError('profile_username', errorMsg, true);
                    } else if (errorMsg.toLowerCase().includes('jelszó') || errorMsg.toLowerCase().includes('password')) {
                        showError('profile_current_password', errorMsg, true);
                    } else {
                        // Ha nem tudjuk beazonosítani, alert-tel jelezzük
                        alert(errorMsg);
                    }
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

    // Kérelem keresés
    const requestSearchInput = document.getElementById('request_search_input');
    if (requestSearchInput) {
        requestSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const requestContainers = document.querySelectorAll('.request_container');
            requestContainers.forEach(function(container) {
                const requestTitle = container.querySelector('h2');
                const requestParagraphs = container.querySelectorAll('p');
                
                if (requestTitle) {
                    const titleText = requestTitle.textContent.toLowerCase();
                    let paragraphText = '';
                    requestParagraphs.forEach(function(p) {
                        paragraphText += p.textContent.toLowerCase() + ' ';
                    });
                    
                    if (searchTerm === '' || titleText.includes(searchTerm) || paragraphText.includes(searchTerm)) {
                        container.style.display = 'block';
                    } else {
                        container.style.display = 'none';
                    }
                }
            });
        });
    }

    // Chatszoba keresés
    const chatroomSearchInput = document.getElementById('chatroom_search_input');
    if (chatroomSearchInput) {
        chatroomSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const chatroomContainers = document.querySelectorAll('.chatroom_container');
            chatroomContainers.forEach(function(container) {
                const chatroomTitle = container.querySelector('h2');
                const chatroomParagraphs = container.querySelectorAll('p');
                
                if (chatroomTitle) {
                    const titleText = chatroomTitle.textContent.toLowerCase();
                    let paragraphText = '';
                    chatroomParagraphs.forEach(function(p) {
                        paragraphText += p.textContent.toLowerCase() + ' ';
                    });
                    
                    if (searchTerm === '' || titleText.includes(searchTerm) || paragraphText.includes(searchTerm)) {
                        container.style.display = 'block';
                    } else {
                        container.style.display = 'none';
                    }
                }
            });
        });
    }

    // Követés gombok közötti váltás
    document.addEventListener('click', function(e) {
        const followButton = e.target.closest('.content_follow_button');
        if (followButton) {
            e.preventDefault();
            e.stopPropagation();
            const container = followButton.closest('.content_container');
            const unfollowButton = container ? container.querySelector('.content_unfollow_button') : null;         
            if (unfollowButton) {
                followButton.style.display = 'none';
                unfollowButton.style.display = 'flex';
            }
        }
        
        const unfollowButton = e.target.closest('.content_unfollow_button');
        if (unfollowButton) {
            e.preventDefault();
            e.stopPropagation();
            const container = unfollowButton.closest('.content_container');
            const followButton = container ? container.querySelector('.content_follow_button') : null;       
            if (followButton) {
                unfollowButton.style.display = 'none';
                followButton.style.display = 'flex';
            }
        }
    });

    // Upvote és downvote kezelés
    document.addEventListener('click', function(e) {
        const upvoteButton = e.target.closest('.upvote_button');
        if (upvoteButton) {
            e.preventDefault();
            e.stopPropagation();  
            const container = upvoteButton.closest('.voting_container');
            const downvoteButton = container ? container.querySelector('.downvote_button') : null;
            upvoteButton.classList.toggle('active');
            if (upvoteButton.classList.contains('active') && downvoteButton) {
                downvoteButton.classList.remove('active');
            }
        }
        
        const downvoteButton = e.target.closest('.downvote_button');
        if (downvoteButton) {
            e.preventDefault();
            e.stopPropagation();
            const container = downvoteButton.closest('.voting_container');
            const upvoteButton = container ? container.querySelector('.upvote_button') : null;
            downvoteButton.classList.toggle('active');
            if (downvoteButton.classList.contains('active') && upvoteButton) {
                upvoteButton.classList.remove('active');
            }
        }
    });

// Chatszoba
(() => {
    // Csak akkor fut, ha chatszoba oldalon vagyunk
    const chatroomPage = document.getElementById('chatszobak');
    if (!chatroomPage) return;

    const chatMessages = document.getElementById('chat_messages');
    const chatText = document.getElementById('chat_text');
    const chatComposer = document.getElementById('chat_composer');
    let activeChatroomId = null;

    // Chatszobák generálása
    async function generateChatroomList() {
        const chatConvList = document.getElementById('chat_conv_list');
        if (!chatConvList) return;
        
        try {
            const response = await fetch('php/getChatrooms.php?mode=neptun');
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a chatszobákat');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                console.error('Hiba:', result.message);
                return;
            }
            
            const chatrooms = result.chatrooms;
            chatConvList.innerHTML = '';
            
            if (chatrooms && chatrooms.length > 0) {
                chatrooms.forEach(room => {
                    chatConvList.insertAdjacentHTML('beforeend', `
                        <li><a class="chat_list_item" data-room-id="${room.room_id}">${escapeHtml(room.title)}</a></li>
                    `);
                });
            }
            
            // Chatszobák betöltése után inicializáljuk a chatszoba kezelést
            initializeChatroom();
        } catch (error) {
            console.error('Hiba a chatszobák betöltése közben:', error);
        }
    }
    
    // Chatszoba inicializálása
    function initializeChatroom() {
        const chatListItems = document.querySelectorAll('.chat_list_item');
        
        // Kezdeti chatszoba betöltése
        const urlParams = new URLSearchParams(window.location.search);
        const roomIdFromUrl = urlParams.get('room_id');
        
        if (roomIdFromUrl) {
            const roomInList = Array.from(chatListItems).find(item => item.dataset.roomId === roomIdFromUrl);
            if (roomInList) {
                roomInList.parentElement.classList.add('active');
                activeChatroomId = roomInList.dataset.roomId;
                loadMessages(activeChatroomId);
            } else {
                // Ha a felhasználó nem része a szobának, ellenőrizzük, hogy létezik-e
                fetch(`php/checkChatroom.php?room_id=${roomIdFromUrl}`)
                    .then(response => response.json())
                    .then(result => {
                        if (!result.success || !result.exists) {
                            if (chatMessages) {
                                chatMessages.innerHTML = '<h2 class="no_content_message">Nincs ilyen szoba.</h2>';
                                // chatComposer ideiglenes letiltása
                                if (chatComposer) chatComposer.style.display = 'none';
                            }
                        } else {
                            activeChatroomId = roomIdFromUrl;
                            loadMessages(activeChatroomId);
                        }
                    })
                    .catch(error => {
                        console.error('Hiba:', error);
                    });
            }
        } 
        else if (chatListItems.length > 0) {
            const firstRoom = chatListItems[0];
            firstRoom.parentElement.classList.add('active');
            activeChatroomId = firstRoom.dataset.roomId;
            loadMessages(activeChatroomId);
        }

        // Chatszoba váltás event listener-ek hozzáadása
        chatListItems.forEach((item) => {
            const listItem = item.parentElement;   
            const handleClick = function(e) {
                // chatComposer megjelenítése, ha el van rejtve
                if (chatComposer) chatComposer.style.display = 'flex';
                e.preventDefault();
                e.stopPropagation();
                const selectedRoomId = item.dataset.roomId;
                if (selectedRoomId === activeChatroomId) return;
                chatListItems.forEach(li => li.parentElement.classList.remove('active'));
                listItem.classList.add('active');      
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                const header = document.querySelector('header');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (header) header.classList.remove('menu-open');
                }
                activeChatroomId = selectedRoomId;
                loadMessages(activeChatroomId);
            };
            
            item.addEventListener('click', handleClick);
            listItem.addEventListener('click', handleClick);
        });
        
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
    }
    
    // Chatszobák generálása
    generateChatroomList();

    // Üzenetek betöltése
    async function loadMessages(roomId) {
        if (!chatMessages || !roomId) return;
        
        try {
            const response = await fetch(`php/getMessages.php?room_id=${roomId}`);
            
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni az üzeneteket');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                console.error('Hiba:', result.message);
                chatMessages.innerHTML = '<h2 class="no_content_message">Hiba az üzenetek betöltése közben.</h2>';
                return;
            }
            
            // Üzenetek megjelenítése
            chatMessages.innerHTML = '';
            
            if (!result.has_messages) {
                // Ha nincs üzenet, rendszer üzenet jelenik meg
                chatMessages.innerHTML = '<div class="chat_row other"><div class="chat_bubble"><div>Még nincs üzenet ebben a chatszobában! Légy te az első!</div><div class="chat_meta">Rendszer • ' + getCurrentTimestamp() + '</div></div></div>';
            } else {
                // Üzenetek megjelenítése
                result.messages.forEach(message => {
                    displayMessage(message.text, message.is_me, message.sender_nickname, message.send_time);
                });
            }
            
        } catch (error) {
            console.error('Hiba az üzenetek betöltése közben:', error);
            chatMessages.innerHTML = '<h2 class="no_content_message">Hiba az üzenetek betöltése közben.</h2>';
        }
    }

    // Üzenet küldése
    if (chatComposer && chatText) {
        chatComposer.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const messageText = chatText.value.trim();
            if (!messageText) return;

            // TODO: Backend - Üzenet mentése adatbázisba (amennyiben a szoba létezik)

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
    }

    // Üzenet megjelenítése
    function displayMessage(text, isMe = false, senderNickname = null, sendTime = null) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat_row ${isMe ? 'me' : 'other'}`;
        
        // Ha nincs megadva küldő és idő, akkor aktuális adatokat használunk (új üzenet esetén)
        const displayName = isMe ? 'Én' : (senderNickname || 'Felhasználó');
        const displayTime = sendTime ? formatTimestamp(sendTime) : getCurrentTimestamp();
        
        messageDiv.innerHTML = `
            <div class="chat_bubble ${isMe ? 'me' : ''}">
                <div>${escapeHtml(text)}</div>
                <div class="chat_meta">${escapeHtml(displayName)} • ${displayTime}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Időbélyeg formázása
    function getCurrentTimestamp() {
        const now = new Date();
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    
    // Backend-ről érkező időbélyeg formázása (YYYY-MM-DD HH:MM:SS formátumból)
    function formatTimestamp(timestamp) {
        if (!timestamp) return getCurrentTimestamp();
        
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function pad(num) {
        return String(num).padStart(2, '0');
    }

    // TODO: Backend - Új üzenetek időszakos lekérése (pl. AJAX segítségével)

    // Oldalsáv kezelése
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const backgroundOverlay = document.getElementById('background-overlay');
    
    if (sidebarToggle && sidebarClose && sidebar && backgroundOverlay) {
        // Kezdeti állapot beállítása mobilon (600px alatt)
        function handleSidebarResize() {
            if (window.innerWidth <= 600) {
                sidebar.classList.remove('visible');
                sidebar.classList.add('hidden');
                backgroundOverlay.style.display = 'none';
            } else {
                // Nagyobb képernyőn eltávolítjuk a mobilos osztályokat
                sidebar.classList.remove('hidden');
                sidebar.classList.remove('visible');
                backgroundOverlay.style.display = 'none';
            }
        }
        
        // Kezdeti állapot beállítása
        handleSidebarResize();
        
        // Ablak átméretezésekor újra ellenőrzés
        window.addEventListener('resize', handleSidebarResize);
        
        // Sidebar megnyitása a toggle gombbal
        sidebarToggle.addEventListener('click', function() {
            if (sidebar.classList.contains('hidden')) {
                sidebar.classList.remove('hidden');
                sidebar.classList.add('visible');
                backgroundOverlay.style.display = 'block';
            }
        });

        // Sidebar bezárása a close gombbal
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('visible');
            sidebar.classList.add('hidden');
            backgroundOverlay.style.display = 'none';
        });
        
        // Sidebar bezárása a háttérre kattintva
        backgroundOverlay.addEventListener('click', function() {
            sidebar.classList.remove('visible');
            sidebar.classList.add('hidden');
            backgroundOverlay.style.display = 'none';
        });
    }
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
// Tárgy törlése
document.addEventListener('click', async function(e) {
    const deleteButton = e.target.closest('.own_subject_container .content_delete_button');
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a tárgyat?')) {
            return;
        }
        
        const container = deleteButton.closest('.own_subject_container');
        const classCode = container.querySelector('p').textContent.trim();
        
        if (!classCode) {
            alert('Hiba: Nem található a tárgy kódja!');
            return;
        }
        
        try {
            showLoading('Tárgy törlése...');
            
            const response = await fetch('php/delete_subject.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ class_code: classCode })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a tárgyat.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk az oldalról
                    container.remove();
                    
                    // Ha nincs több tárgy, megjelenítjük az üres üzenetet
                    const userSubjectsSection = document.getElementById('user_subjects');
                    if (userSubjectsSection) {
                        const remainingSubjects = userSubjectsSection.querySelectorAll('.own_subject_container');
                        if (remainingSubjects.length === 0) {
                            userSubjectsSection.innerHTML = '<h2 class="no_content_message">Még nincsenek felvett tárgyaid.</h2>';
                        }
                    }
                    
                    alert('Tárgy sikeresen törölve!');
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a tárgyat!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Tárgy törlési hiba:', error);
            alert('Hiba történt a tárgy törlése során: ' + error.message);
        }
    }
});

// Dashboard saját fájlok törlése (list nézetből)
document.addEventListener('click', async function(e) {
    const deleteButton = e.target.closest('.own_file_container .content_delete_button');
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        const container = deleteButton.closest('.own_file_container');
        const detailsLink = container.querySelector('.own_details_link');
        const upId = detailsLink ? detailsLink.getAttribute('data-up-id') : null;
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ up_id: upId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a fájlt.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a fájlkártyát az oldalról
                    container.remove();
                    
                    // Ha nincs több fájl, megjelenítjük az üres üzenetet
                    const fileContainer = document.getElementById('dashboard_file_container');
                    if (fileContainer) {
                        const remainingFiles = fileContainer.querySelectorAll('.own_file_container');
                        if (remainingFiles.length === 0) {
                            fileContainer.innerHTML = '<h2 class="no_content_message">Még nem töltöttél fel fájlokat.</h2>';
                        }
                    }
                    
                    alert('Fájl sikeresen törölve!');
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a fájlt!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Fájl törlési hiba:', error);
            alert('Hiba történt a fájl törlése során: ' + error.message);
        }
    }
});

// Fájl törlése
document.addEventListener('click', async function(e) {
    const deleteButton = e.target.closest('.own_file_details_modal .modal_delete_button');
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        const modal = deleteButton.closest('.own_file_details_modal');
        const upId = modal ? modal.getAttribute('data-up-id') : null;
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ up_id: upId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a fájlt.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Bezárjuk a modalt
                    const modalCloseButton = modal.querySelector('.modal_close_button');
                    if (modalCloseButton) {
                        modalCloseButton.click();
                    }
                    
                    // Eltávolítjuk a fájlkártyát az oldalról
                    const container = document.querySelector(`.own_file_container .own_details_link[data-up-id="${upId}"]`)?.closest('.own_file_container');
                    if (container) {
                        container.remove();
                    }
                    
                    // Ha nincs több fájl, megjelenítjük az üres üzenetet
                    const fileContainer = document.getElementById('dashboard_file_container') || 
                                         document.getElementById('subject_file_container');
                    if (fileContainer) {
                        const remainingFiles = fileContainer.querySelectorAll('.uploaded_files_container');
                        if (remainingFiles.length === 0) {
                            fileContainer.innerHTML = '<h2 class="no_content_message">Még nem töltöttél fel fájlokat.</h2>';
                        }
                    }
                    
                    alert('Fájl sikeresen törölve!');
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a fájlt!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Fájl törlési hiba:', error);
            alert('Hiba történt a fájl törlése során: ' + error.message);
        }
    }
});
// Fájl letöltése - ezt illeszd be a scripts.js fájlba

// Fájl letöltése a lista nézetből (dashboard és subject oldalon)
document.addEventListener('click', function(e) {
    const downloadButton = e.target.closest('.content_download_button');
    if (downloadButton) {
        e.preventDefault();
        e.stopPropagation();
        
        const container = downloadButton.closest('.uploaded_files_container') || 
                         downloadButton.closest('.own_file_container');
        
        // Megpróbáljuk megtalálni az up_id-t
        let upId = null;
        
        // Először a details link-ből próbáljuk
        const detailsLink = container.querySelector('.own_details_link') || 
                           container.querySelector('.file_details_link');
        if (detailsLink) {
            upId = detailsLink.getAttribute('data-up-id');
        }
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        // Letöltés indítása
        downloadFile(upId);
    }
});

// Fájl letöltése
document.addEventListener('click', function(e) {
    const downloadButton = e.target.closest('.modal_download_button');
    if (downloadButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megkeressük a modal-t és az up_id-t
        const modal = downloadButton.closest('.modal');
        const upId = modal ? modal.getAttribute('data-up-id') : null;
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        // Letöltés indítása
        downloadFile(upId);
    }
});

// Letöltés végrehajtása
function downloadFile(upId) {
    try {
        // Létrehozunk egy láthatatlan link elemet
        const downloadLink = document.createElement('a');
        downloadLink.href = `php/download_file.php?up_id=${upId}`;
        downloadLink.download = ''; // Ez arra kényszeríti, hogy letöltse a fájlt
        
        // Hozzáadjuk a DOM-hoz, kattintunk rá, majd eltávolítjuk
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Opcionális: loading animáció rövid időre
        showLoading('Letöltés indítása...');
        setTimeout(() => {
            hideLoading();
        }, 1000);
        
    } catch (error) {
        console.error('Letöltési hiba:', error);
        alert('Hiba történt a fájl letöltése során!');
    }
}
// Fájl szerkesztés és feltöltés funkciók - illeszd be a scripts.js fájlba

// =========================
// FÁJL SZERKESZTÉS MODAL MEGNYITÁSA
// =========================

// Szerkesztés gomb a modal-ban
document.addEventListener('click', async function(e) {
    const editButton = e.target.closest('.own_file_details_modal .edit_file_button');
    if (editButton) {
        e.preventDefault();
        e.stopPropagation();
        
        const detailsModal = editButton.closest('.own_file_details_modal');
        const upId = detailsModal ? detailsModal.getAttribute('data-up-id') : null;
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        // Adatok betöltése a szerkesztő modal-ba
        const fileTitle = detailsModal.querySelector('.data-file-title')?.textContent || '';
        const fileDescription = detailsModal.querySelector('.data-file-description')?.textContent || '';
        
        const editModal = document.querySelector('.edit_file_modal');
        if (editModal) {
            // Up_id beállítása a modal-on
            editModal.setAttribute('data-up-id', upId);
            
            // Form mezők kitöltése
            const titleInput = editModal.querySelector('#fileTitle');
            const descriptionTextarea = editModal.querySelector('#fileDescription');
            
            if (titleInput) titleInput.value = fileTitle;
            if (descriptionTextarea) descriptionTextarea.value = fileDescription;
            
            // Részletek modal bezárása
            const closeButton = detailsModal.querySelector('.modal_close_button');
            if (closeButton) closeButton.click();
            
            // Szerkesztő modal megnyitása
            editModal.classList.remove('hidden');
        }
    }
});

// =========================
// FÁJL SZERKESZTÉS MENTÉSE
// =========================

const editFileForm = document.getElementById('editFileForm');
if (editFileForm) {
    editFileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const modal = this.closest('.edit_file_modal');
        const upId = modal ? modal.getAttribute('data-up-id') : null;
        
        if (!upId) {
            alert('Hiba: Nem található a fájl azonosítója!');
            return;
        }
        
        const formData = new FormData(this);
        formData.append('up_id', upId);
        
        try {
            showLoading('Fájl módosítása...');
            
            const response = await fetch('php/edit_file.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült módosítani a fájlt.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    alert('Fájl sikeresen módosítva!');
                    
                    // Modal bezárása
                    const closeButton = modal.querySelector('.edit_close_button');
                    if (closeButton) closeButton.click();
                    
                    // Oldal újratöltése a frissített adatokért
                    window.location.reload();
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült módosítani a fájlt!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Fájl módosítási hiba:', error);
            alert('Hiba történt a fájl módosítása során: ' + error.message);
        }
    });
}

// =========================
// FÁJL FELTÖLTÉS
// =========================

const uploadFileForm = document.getElementById('upload_file_form');
if (uploadFileForm) {
    uploadFileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Tárgy kód lekérése az URL-ből
        const urlParams = new URLSearchParams(window.location.search);
        const classCode = urlParams.get('class_code');
        
        if (!classCode) {
            alert('Hiba: Nem található a tárgy kód!');
            return;
        }
        
        const formData = new FormData(this);
        formData.append('class_code', classCode);
        
        // Ellenőrizzük, hogy ki lett-e választva fájl
        const fileInput = document.getElementById('file_upload');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Kérlek válassz ki egy fájlt!');
            return;
        }
        
        try {
            showLoading('Fájl feltöltése...');
            
            const response = await fetch('php/upload_file.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült feltölteni a fájlt.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    alert('Fájl sikeresen feltöltve!');
                    
                    // Form reset
                    uploadFileForm.reset();
                    
                    // Modal bezárása
                    const modal = uploadFileForm.closest('.upload_file_modal');
                    if (modal) {
                        const closeButton = modal.querySelector('.upload_close_button');
                        if (closeButton) closeButton.click();
                    }
                    
                    // Fájlok újratöltése
                    if (window.location.pathname.includes('subject.php')) {
                        generateSubjectFiles();
                    } else {
                        generateFiles();
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült feltölteni a fájlt!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Fájl feltöltési hiba:', error);
            alert('Hiba történt a fájl feltöltése során: ' + error.message);
        }
    });
}

// Fájl feltöltés gomb megnyitása kérelemből
document.addEventListener('click', function(e) {
    const uploadButton = e.target.closest('.upload_file_button[data-request-id]');
    if (uploadButton) {
        e.preventDefault();
        const requestId = uploadButton.getAttribute('data-request-id');
        
        const uploadModal = document.querySelector('.upload_file_modal');
        if (uploadModal) {
            // Request ID beállítása a form-ra (ha szükséges)
            const form = uploadModal.querySelector('#upload_file_form');
            if (form && requestId) {
                // Létrehozunk egy hidden inputot a request_id-hoz
                let requestInput = form.querySelector('input[name="request_id"]');
                if (!requestInput) {
                    requestInput = document.createElement('input');
                    requestInput.type = 'hidden';
                    requestInput.name = 'request_id';
                    form.appendChild(requestInput);
                }
                requestInput.value = requestId;
            }
            
            uploadModal.classList.remove('hidden');
        }
    }
});

// Admin felület
(() => {
    // Csak akkor fut le, ha admin oldalon vagyunk
    const admin = document.getElementById('admin');
    if (!admin) return;
    
    // Felhasználók kezelése modal megnyitása (később felhasználók betöltése)
    const manageUsersButton = document.getElementById('manageUsersButton');
    if (manageUsersButton) {
        manageUsersButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Felhasználók betöltése...");
            // Felhasználók betöltése később
            /*generateUsers().then(() => {*/
                setTimeout(() => {
                    hideLoading();
                    const adminUsersModal = document.querySelector('.admin_user_modal');
                    if (adminUsersModal) {
                        adminUsersModal.classList.remove('hidden');
                    }  
                }, 500);
            /*});*/
        });
    }

    // Tárgyak kezelése modal megnyitása (később tárgyak betöltése)
    const manageSubjectsButton = document.getElementById('manageSubjectsButton');
    if (manageSubjectsButton) {
        manageSubjectsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Tárgyak betöltése...");
            // Tárgyak betöltése később
            /*generateAdminSubjects().then(() => {*/
                setTimeout(() => {
                    hideLoading();
                    const adminSubjectsModal = document.querySelector('.admin_subject_modal');
                    if (adminSubjectsModal) {
                        adminSubjectsModal.classList.remove('hidden');
                    }  
                }, 500);
            /*});*/
        });
    }

    // Új tárgy hozzáadása modal megnyitása
    const newSubjectButton = document.getElementsByClassName('new_subject_button')[0];
    if (newSubjectButton) {
        newSubjectButton.addEventListener('click', function(e) {
            e.preventDefault();
            const newSubjectModal = document.querySelector('.admin_add_subject_modal');
            if (newSubjectModal) {
                newSubjectModal.classList.remove('hidden');
            }  
        });
    }

    // Tárgy szerkesztés modal megnyitása delegált eseménykezelővel
    document.addEventListener('click', function(e) {
        const editSubjectButton = e.target.closest('.admin_subject_container .subject_edit_button');
        if (editSubjectButton) {
            e.preventDefault();
            e.stopPropagation();
            const editModal = document.querySelector('.admin_edit_subject_modal');
            if (editModal) {
                // Tárgy adatok betöltése a modal-ba később
                editModal.classList.remove('hidden');
            }
        }
    });

    // Fájlok kezelése modal megnyitása (később fájlok betöltése)
    const manageFilesButton = document.getElementById('manageFilesButton');
    if (manageFilesButton) {
        manageFilesButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Fájlok betöltése...");
            // Fájlok betöltése később
            /*generateAdminFiles().then(() => {*/
                setTimeout(() => {
                    hideLoading();
                    const adminFilesModal = document.querySelector('.admin_files_modal');
                    if (adminFilesModal) {
                        adminFilesModal.classList.remove('hidden');
                    }  
                }, 500);
            /*});*/
        });
    }

    // Kérelmek kezelése modal megnyitása (később kérelmek betöltése)
    const manageRequestsButton = document.getElementById('manageRequestsButton');
    if (manageRequestsButton) {
        manageRequestsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Kérelmek betöltése...");
            // Kérelmek betöltése később
            /*generateAdminRequests().then(() => {*/
                setTimeout(() => {
                    hideLoading();
                    const adminRequestsModal = document.querySelector('.admin_requests_modal');
                    if (adminRequestsModal) {
                        adminRequestsModal.classList.remove('hidden');
                    }  
                }, 500);
            /*});*/
        });
    }

    // Chatszobák kezelése modal megnyitása (később chatszobák betöltése)
    const manageChatroomsButton = document.getElementById('manageChatroomsButton');
    if (manageChatroomsButton) {
        manageChatroomsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Chatszobák betöltése...");
            // Chatszobák betöltése később
            /*generateAdminChatrooms().then(() => {*/
                setTimeout(() => {
                    hideLoading();
                    const adminChatroomsModal = document.querySelector('.admin_chatrooms_modal');
                    if (adminChatroomsModal) {
                        adminChatroomsModal.classList.remove('hidden');
                    }  
                }, 500);
            /*});*/
        });
    }

    // Admin modal keresés - univerzális keresési funkció minden admin modalhoz
    document.addEventListener('input', function(e) {
        const searchInput = e.target;
        
        // Ellenőrizzük, hogy az input elem admin modal keresőmező-e
        if (!searchInput.classList.contains('admin_search_input')) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Megkeressük a modal-t
        const modal = searchInput.closest('.modal');
        if (!modal) return;
        
        // Megkeressük az összes admin_container elemet
        const containers = modal.querySelectorAll('.admin_container');
        
        containers.forEach(function(container) {
            // Lekérjük az összes h2, h3 és p elemet a konténerben
            const h2Elements = container.querySelectorAll('h2');
            const h3Elements = container.querySelectorAll('h3');
            const pElements = container.querySelectorAll('p');
            
            // Ha nincs keresési kifejezés, mindent megjelenítünk
            if (searchTerm === '') {
                container.style.display = '';
                return;
            }
            
            // Összegyűjtjük a szöveges tartalmakat
            let textContent = '';
            
            h2Elements.forEach(function(h2) {
                textContent += ' ' + h2.textContent.toLowerCase();
            });
            
            h3Elements.forEach(function(h3) {
                textContent += ' ' + h3.textContent.toLowerCase();
            });
            
            pElements.forEach(function(p) {
                textContent += ' ' + p.textContent.toLowerCase();
            });
            
            // Ellenőrizzük, hogy a keresési kifejezés megtalálható-e
            if (textContent.includes(searchTerm)) {
                container.style.display = '';
            } else {
                container.style.display = 'none';
            }
        });
    });

})();