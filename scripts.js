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
                                <h2>${escapeHtml(file.title)}</h2>
                                <p>${escapeHtml(file.description)}</p>
                                <p>Én, ${escapeHtml(file.upload_date)}</p>
                            </div>
                        `);
                    } else {
                        const upvoteActive = file.user_vote === 1 ? ' active' : '';
                        const downvoteActive = file.user_vote === -1 ? ' active' : '';
                        
                        fileSection.insertAdjacentHTML('beforeend', `
                            <div class="content_container uploaded_files_container" data-up-id="${file.up_id}">
                                <a href="#" class="container_link file_details_link" data-up-id="${file.up_id}" aria-label="Fájl részletei"></a>
                                <button class="button small_button content_download_button" aria-label="Letöltés">
                                    <span class="icon_text">Letöltés</span>
                                    <img src="icons/download.svg" alt="Letöltés">
                                </button>
                                <div class="content_downloads">
                                    <span>${file.downloads}<span class="hideable_text"> letöltés</span></span>
                                    <img src="icons/download.svg" alt="Letöltések">
                                </div>
                                <div class="content_voting voting_container hideable_content" data-up-id="${file.up_id}">
                                    <span class="vote_count">${file.rating}</span>
                                    <button class="button small_button content_downvote_button downvote_button${downvoteActive}" aria-label="Nem tetszik">
                                        <img src="icons/downvote.svg" alt="Nem tetszik">
                                    </button>  
                                    <button class="button small_button content_upvote_button upvote_button${upvoteActive}" aria-label="Tetszik">
                                        <img src="icons/upvote.svg" alt="Tetszik">
                                    </button>  
                                </div>
                                <h2>${escapeHtml(file.title)}</h2>
                                <p>${escapeHtml(file.description)}</p>
                                <p>${escapeHtml(file.uploader_nickname)}, ${escapeHtml(file.upload_date)}</p>
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
                        // Admin átirányítás admin.php-ra, egyébként dashboard.php-ra
                        if (result.isAdmin) {
                            window.location.href = 'admin.php';
                        } else {
                            window.location.href = 'dashboard.php';
                        }
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
                    
                    // Szavazás gombok kezdeti állapota
                    const votingContainer = fileDetailsModal.querySelector('.voting_container');
                    if (votingContainer) {
                        const upvoteBtn = votingContainer.querySelector('.upvote_button');
                        const downvoteBtn = votingContainer.querySelector('.downvote_button');
                        
                        if (upvoteBtn) upvoteBtn.classList.remove('active');
                        if (downvoteBtn) downvoteBtn.classList.remove('active');
                        
                        if (data.user_vote === 1 && upvoteBtn) {
                            upvoteBtn.classList.add('active');
                        } else if (data.user_vote === -1 && downvoteBtn) {
                            downvoteBtn.classList.add('active');
                        }
                    }
                    
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
                    
                    // Szavazás gombok kezdeti állapota
                    const votingContainer = ownCompletedRequestsModal.querySelector('.voting_container');
                    if (votingContainer) {
                        const upvoteBtn = votingContainer.querySelector('.upvote_button');
                        const downvoteBtn = votingContainer.querySelector('.downvote_button');
                        
                        if (upvoteBtn) upvoteBtn.classList.remove('active');
                        if (downvoteBtn) downvoteBtn.classList.remove('active');
                        
                        if (data.user_vote === 1 && upvoteBtn) {
                            upvoteBtn.classList.add('active');
                        } else if (data.user_vote === -1 && downvoteBtn) {
                            downvoteBtn.classList.add('active');
                        }
                    }
                    
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
            const fileInput = document.getElementById('fileUpload');
            if (this.checked) {
                fileUploadSection.style.display = 'block';
                if (fileInput) {
                    fileInput.setAttribute('required', '');
                }
            } else {
                fileUploadSection.style.display = 'none';
                if (fileInput) {
                    fileInput.value = '';
                    fileInput.removeAttribute('required');
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

    // Upvote és downvote kezelés - backend hívás a fő eseménykezelőben

// Chatszoba
(() => {
    // Csak akkor fut, ha chatszoba oldalon vagyunk
    const chatroomPage = document.getElementById('chatszobak');
    if (!chatroomPage) return;

    const chatMessages = document.getElementById('chat_messages');
    const chatText = document.getElementById('chat_text');
    const chatComposer = document.getElementById('chat_composer');
    let activeChatroomId = null;
    
    // Polling változók
    let chatPollingInterval = null;
    let lastKnownMessageId = 0;

    // 1. Chatszobák listázása
    async function generateChatroomList() {
        const chatConvList = document.getElementById('chat_conv_list');
        if (!chatConvList) return;
        
        try {
            const response = await fetch('php/getChatrooms.php?mode=neptun');
            if (!response.ok) throw new Error('Hiba a listázáskor');
            
            const result = await response.json();
            if (!result.success) return;
            
            const chatrooms = result.chatrooms;
            chatConvList.innerHTML = '';
            
            if (chatrooms && chatrooms.length > 0) {
                chatrooms.forEach(room => {
                    const safeTitle = room.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    chatConvList.insertAdjacentHTML('beforeend', `
                        <li><a class="chat_list_item" data-room-id="${room.room_id}">${safeTitle}</a></li>
                    `);
                });
            }
            
            initializeChatroom(); // Lista kész, inicializálunk
        } catch (error) {
            console.error('Hiba a szobák betöltésekor:', error);
        }
    }
    
    // HTML tisztítás
    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 2. Szobaválasztás kezelése
    function initializeChatroom() {
        const chatListItems = document.querySelectorAll('.chat_list_item');
        const urlParams = new URLSearchParams(window.location.search);
        const roomIdFromUrl = urlParams.get('room_id');
        
        if (roomIdFromUrl) {
            const roomInList = Array.from(chatListItems).find(item => item.dataset.roomId === roomIdFromUrl);
            if (roomInList) {
                selectRoom(roomInList);
            } else {
                activeChatroomId = roomIdFromUrl;
                startChat(activeChatroomId);
            }
        } else if (chatListItems.length > 0) {
            selectRoom(chatListItems[0]);
        }

        // Kattintás események (delegálva a szülőre ha lehetne, de most így is jó)
        chatListItems.forEach(item => {
            // A linkre és a szülő <li>-re is teszünk figyelőt
            const handler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectRoom(item);
            };
            item.addEventListener('click', handler);
            item.parentElement.addEventListener('click', handler);
        });
    }

    function selectRoom(itemElement) {
        document.querySelectorAll('.chat_list_item').forEach(li => li.parentElement.classList.remove('active'));
        itemElement.parentElement.classList.add('active');
        
        // Mobilon bezárjuk a menüt
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 600) {
            sidebar.classList.remove('visible');
            sidebar.classList.add('hidden');
            const overlay = document.getElementById('background-overlay');
            if(overlay) overlay.style.display = 'none';
        }

        activeChatroomId = itemElement.dataset.roomId;
        startChat(activeChatroomId);
    }

    // 3. Chat indítása (Polling)
    function startChat(roomId) {
        if (chatPollingInterval) clearInterval(chatPollingInterval);
        lastKnownMessageId = 0;
        chatMessages.innerHTML = ''; 
        if (chatComposer) chatComposer.style.display = 'flex';

        fetchNewMessages(roomId); // Azonnali lekérés

        // 3 másodpercenként frissítés
        chatPollingInterval = setInterval(() => {
            if (activeChatroomId === roomId) {
                fetchNewMessages(roomId);
            }
        }, 3000);
    }

    // 4. Üzenetek lekérése
    async function fetchNewMessages(roomId) {
        try {
            const response = await fetch(`php/getMessages.php?room_id=${roomId}&last_id=${lastKnownMessageId}`);
            const result = await response.json();
            
            if (result.success && result.messages.length > 0) {
                result.messages.forEach(msg => {
                    displayMessage(msg.text, msg.is_me, msg.sender_nickname, msg.send_time);
                    
                    const msgId = parseInt(msg.msg_id);
                    if (msgId > lastKnownMessageId) {
                        lastKnownMessageId = msgId;
                    }
                });
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else if (lastKnownMessageId === 0 && (!result.messages || result.messages.length === 0)) {
                 chatMessages.innerHTML = '<div class="chat_row other"><div class="chat_bubble">Még nincs üzenet. Légy te az első!</div></div>';
            }
        } catch (error) {
            console.error('Chat polling hiba:', error);
        }
    }

    // 5. Üzenet megjelenítése
    function displayMessage(text, isMe, senderName, time) {
        if (chatMessages.innerHTML.includes('Még nincs üzenet')) {
            chatMessages.innerHTML = '';
        }

        const row = document.createElement('div');
        row.className = `chat_row ${isMe ? 'me' : 'other'}`;
        
        const dateObj = new Date(time);
        const timeStr = isNaN(dateObj.getTime()) ? time : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            <div class="chat_bubble ${isMe ? 'me' : ''}">
                <div class="message_text">${escapeHtml(text)}</div>
                <div class="chat_meta">${escapeHtml(isMe ? 'Én' : senderName)} • ${timeStr}</div>
            </div>
        `;
        
        chatMessages.appendChild(row);
    }

    // 6. Üzenet KÜLDÉSE
    if (chatComposer) {
        chatComposer.addEventListener('submit', async function(e) {
            e.preventDefault();
            const text = chatText.value.trim();
            if (!text || !activeChatroomId) return;

            chatText.value = ''; // Mező törlése azonnal

            try {
                const response = await fetch('php/send_message.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        room_id: activeChatroomId,
                        text: text
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    fetchNewMessages(activeChatroomId); // Frissítés
                } else {
                    alert('Hiba: ' + result.error);
                }
            } catch (err) {
                console.error(err);
                alert('Küldési hiba!');
            }
        });

        chatText.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatComposer.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Oldalsáv (Sidebar) kezelése mobilon
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const backgroundOverlay = document.getElementById('background-overlay');
    
    if (sidebarToggle && sidebarClose && sidebar && backgroundOverlay) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('visible');
            backgroundOverlay.style.display = 'block';
        });

        const closeSidebar = () => {
            sidebar.classList.remove('visible');
            sidebar.classList.add('hidden');
            backgroundOverlay.style.display = 'none';
        };

        sidebarClose.addEventListener('click', closeSidebar);
        backgroundOverlay.addEventListener('click', closeSidebar);
    }

    // Indítás
    generateChatroomList();
})();

// Tárgy felvétele
document.addEventListener('click', async function(e) {
    if (e.target.closest('.subject_add_button')) {
        const button = e.target.closest('.subject_add_button');
        const classCode = button.getAttribute('data-class-code');
        
        if (!classCode) return;
        button.disabled = true;
        
        try {
            showLoading('Tárgy felvétele...');
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
            setTimeout(async () => {  
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
                        } catch (error) {
                            console.error('Hiba történt a tárgy részleteinek lekérésekor:', error);
                        }
                    }
                } else {
                    throw new Error(result.error || 'Ismeretlen hiba történt.');
                }
                hideLoading();
            }, 1250);
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

// =========================
// KÉRELEM TÖRLÉSE (list nézetből)
// =========================

document.addEventListener('click', async function(e) {
    // Keressük a törlés gombot - működik dashboard és subject oldalon is
    const deleteButton = e.target.closest('.request_container .content_delete_button') ||
                        e.target.closest('.own_uncompleted_request_container .content_delete_button');
    
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
            return;
        }
        
        const container = deleteButton.closest('.own_uncompleted_request_container') ||
                         deleteButton.closest('.request_container');
        const detailsLink = container.querySelector('.own_uncompleted_requests_link');
        const requestId = detailsLink ? detailsLink.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosítója!');
            return;
        }
        
        try {
            showLoading('Kérelem törlése...');
            
            const response = await fetch('php/delete_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ request_id: requestId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a kérelmet.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a kérelemkártyát az oldalról
                    container.remove();
                    
                    // Ha nincs több kérelem, megjelenítjük az üres üzenetet
                    const requestContainer = document.getElementById('dashboard_request_container') || 
                                             document.getElementById('subject_request_container');
                    if (requestContainer) {
                        const remainingRequests = requestContainer.querySelectorAll('.request_container');
                        if (remainingRequests.length === 0) {
                            if (document.getElementById('dashboard_request_container')) {
                                requestContainer.innerHTML = '<h2 class="no_content_message">Még nincsenek kérelmeid.</h2>';
                            } else {
                                requestContainer.innerHTML = '<h2 class="no_content_message">Még nincsenek kérelmek ehhez a tárgyhoz.</h2>';
                            }
                        }
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a kérelmet!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Kérelem törlési hiba:', error);
            alert('Hiba történt a kérelem törlése során: ' + error.message);
        }
    }
});

// =========================
// KÉRELEM TÖRLÉSE (modal-ból)
// =========================

document.addEventListener('click', async function(e) {
    const deleteButton = e.target.closest('.own_uncompleted_requests_modal .modal_delete_button');
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
            return;
        }
        
        const modal = deleteButton.closest('.own_uncompleted_requests_modal');
        const requestId = modal ? modal.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosítója!');
            return;
        }
        
        try {
            showLoading('Kérelem törlése...');
            
            const response = await fetch('php/delete_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ request_id: requestId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a kérelmet.');
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
                    
                    // Eltávolítjuk a kérelemkártyát az oldalról
                    const container = document.querySelector(`.own_uncompleted_requests_link[data-request-id="${requestId}"]`)?.closest('.own_uncompleted_request_container');
                    if (container) {
                        container.remove();
                    }
                    
                    // Ha nincs több kérelem, megjelenítjük az üres üzenetet
                    const requestContainer = document.getElementById('dashboard_request_container') || 
                                             document.getElementById('subject_request_container');
                    if (requestContainer) {
                        const remainingRequests = requestContainer.querySelectorAll('.request_container');
                        if (remainingRequests.length === 0) {
                            requestContainer.innerHTML = '<h2 class="no_content_message">Még nincsenek kérelmeid.</h2>';
                        }
                    }
                    
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a kérelmet!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Kérelem törlési hiba:', error);
            alert('Hiba történt a kérelem törlése során: ' + error.message);
        }
    }
});

// =========================
// CHATSZOBA TÖRLÉSE (list nézetből)
// =========================

document.addEventListener('click', async function(e) {
    // Ellenőrizzük, hogy a törlés gomb egy chatszoba konténerben van-e (dashboard vagy subject oldal)
    const deleteButton = e.target.closest('.chatroom_container .content_delete_button') || 
                        e.target.closest('.own_chatroom_container .content_delete_button');
    
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan törölni szeretnéd ezt a chatszobát? Az összes üzenet is törlődni fog!')) {
            return;
        }
        
        const container = deleteButton.closest('.own_chatroom_container') || 
                         deleteButton.closest('.chatroom_container');
        const roomId = container ? container.getAttribute('data-room-id') : null;
        
        if (!roomId) {
            alert('Hiba: Nem található a chatszoba azonosítója!');
            return;
        }
        
        try {
            showLoading('Chatszoba törlése...');
            
            const response = await fetch('php/delete_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ room_id: roomId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült törölni a chatszobát.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a chatszobakártyát az oldalról
                    container.remove();
                    
                    // Ha nincs több saját chatszoba, megjelenítjük az üres üzenetet
                    const chatroomSection = document.getElementById('dashboard_chatszobak') || 
                                           document.getElementById('subject_chatszobak');
                    if (chatroomSection) {
                        // Dashboard oldalon saját chatszobák ellenőrzése
                        const remainingOwnChatrooms = chatroomSection.querySelectorAll('.own_chatroom_container');
                        // Subject oldalon az összes chatszoba ellenőrzése
                        const remainingChatrooms = chatroomSection.querySelectorAll('.chatroom_container');
                        
                        if (remainingOwnChatrooms.length === 0 && document.getElementById('dashboard_chatszobak')) {
                            const firstHr = chatroomSection.querySelector('hr');
                            if (firstHr) {
                                firstHr.insertAdjacentHTML('afterend', '<h2 class="no_content_message">Még nem hoztál létre chatszobát.</h2><br>');
                            }
                        } else if (remainingChatrooms.length === 0 && document.getElementById('subject_chatszobak')) {
                            chatroomSection.insertAdjacentHTML('beforeend', '<h2 class="no_content_message">Még nincsenek chatszobák ehhez a tárgyhoz.</h2>');
                        }
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült törölni a chatszobát!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Chatszoba törlési hiba:', error);
            alert('Hiba történt a chatszoba törlése során: ' + error.message);
        }
    }
});

// =========================
// CHATSZOBA KÖVETÉS MEGSZÜNTETÉSE
// =========================

document.addEventListener('click', async function(e) {
    const unfollowButton = e.target.closest('.content_unfollow_button');
    if (unfollowButton) {
        e.preventDefault();
        e.stopPropagation();
        
        const container = unfollowButton.closest('.chatroom_container') || 
                         unfollowButton.closest('.followed_chatroom_container');
        
        if (!container) return;
        
        const roomId = container.getAttribute('data-room-id');
        
        if (!roomId) {
            alert('Hiba: Nem található a chatszoba azonosítója!');
            return;
        }
        
        // Megerősítés kérése
        if (!confirm('Biztosan meg szeretnéd szüntetni a chatszoba követését?')) {
            return;
        }
        
        try {
            showLoading('Követés megszüntetése...');
            
            const response = await fetch('php/unfollow_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ room_id: roomId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült megszüntetni a követést.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Dashboard oldalon eltávolítjuk a kártyát
                    if (container.classList.contains('followed_chatroom_container')) {
                        container.remove();
                        
                        // Ha nincs több követett chatszoba, megjelenítjük az üres üzenetet
                        const chatroomSection = document.getElementById('dashboard_chatszobak');
                        if (chatroomSection) {
                            const remainingFollowedChatrooms = chatroomSection.querySelectorAll('.followed_chatroom_container');
                            if (remainingFollowedChatrooms.length === 0) {
                                chatroomSection.insertAdjacentHTML('beforeend', '<h2 class="no_content_message">Még nem követsz chatszobát.</h2>');
                            }
                        }
                    } else {
                        // Subject oldalon csak a gombokat cseréljük
                        const followButton = container.querySelector('.content_follow_button');
                        if (followButton) {
                            unfollowButton.style.display = 'none';
                            followButton.style.display = 'flex';
                        }
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült megszüntetni a követést!'));
                }
            }, 500);
            
        } catch (error) {
            hideLoading();
            console.error('Követés megszüntetési hiba:', error);
            alert('Hiba történt a követés megszüntetése során: ' + error.message);
        }
    }
});

// =========================
// CHATSZOBA KÖVETÉSE
// =========================

document.addEventListener('click', async function(e) {
    const followButton = e.target.closest('.content_follow_button');
    if (followButton) {
        e.preventDefault();
        e.stopPropagation();
        
        const container = followButton.closest('.chatroom_container');
        
        if (!container) return;
        
        const roomId = container.getAttribute('data-room-id');
        
        if (!roomId) {
            alert('Hiba: Nem található a chatszoba azonosítója!');
            return;
        }
        
        try {
            showLoading('Követés...');
            
            const response = await fetch('php/follow_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ room_id: roomId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült követni a chatszobát.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Gombokat cseréljük
                    const unfollowButton = container.querySelector('.content_unfollow_button');
                    if (unfollowButton) {
                        followButton.style.display = 'none';
                        unfollowButton.style.display = 'flex';
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült követni a chatszobát!'));
                }
            }, 500);
            
        } catch (error) {
            hideLoading();
            console.error('Követési hiba:', error);
            alert('Hiba történt a chatszoba követése során: ' + error.message);
        }
    }
});

// =========================
// KÉRELEM LEZÁRÁSA (ELFOGADÁS)
// =========================

document.addEventListener('click', async function(e) {
    const acceptButton = e.target.closest('.own_completed_requests_modal .modal_accept_button');
    if (acceptButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan le szeretnéd zárni ezt a kérelmet? A kérelem törlésre kerül.')) {
            return;
        }
        
        const modal = acceptButton.closest('.own_completed_requests_modal');
        const requestId = modal ? modal.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosítója!');
            return;
        }
        
        try {
            showLoading('Kérelem lezárása...');
            
            const response = await fetch('php/accept_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ request_id: requestId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült lezárni a kérelmet.');
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
                    
                    // Eltávolítjuk a kérelemkártyát az oldalról
                    const container = document.querySelector(`.own_completed_requests_link[data-request-id="${requestId}"]`)?.closest('.request_container') ||
                                     document.querySelector(`.own_completed_requests_link[data-request-id="${requestId}"]`)?.closest('.own_completed_request_container');
                    if (container) {
                        container.remove();
                    }
                    
                    // Ha nincs több kérelem, megjelenítjük az üres üzenetet
                    const requestContainer = document.getElementById('dashboard_request_container');
                    if (requestContainer) {
                        const remainingRequests = requestContainer.querySelectorAll('.request_container');
                        if (remainingRequests.length === 0) {
                            requestContainer.innerHTML = '<h2 class="no_content_message">Még nincsenek kérelmeid.</h2>';
                        }
                    }
                    
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült lezárni a kérelmet!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Kérelem lezárási hiba:', error);
            alert('Hiba történt a kérelem lezárása során: ' + error.message);
        }
    }
});

// =========================
// KÉRELEM ÚJRAKÜLDÉSE (RESET)
// =========================

document.addEventListener('click', async function(e) {
    const resetButton = e.target.closest('.own_completed_requests_modal .modal_reset_button');
    if (resetButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Megerősítés kérése
        if (!confirm('Biztosan újra szeretnéd küldeni a kérelmet? A feltöltött fájl kapcsolata megszűnik a kérelemmel.')) {
            return;
        }
        
        const modal = resetButton.closest('.own_completed_requests_modal');
        const requestId = modal ? modal.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosítója!');
            return;
        }
        
        try {
            showLoading('Kérelem újraküldése...');
            
            const response = await fetch('php/reset_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ request_id: requestId })
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült újraküldeni a kérelmet.');
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
                    
                    // Frissítjük a kérelemkártyát az oldalon (teljesítettből vissza várakozóra)
                    const container = document.querySelector(`.own_completed_requests_link[data-request-id="${requestId}"]`)?.closest('.request_container') ||
                                     document.querySelector(`.own_completed_requests_link[data-request-id="${requestId}"]`)?.closest('.own_completed_request_container');
                    if (container) {
                        // Státusz badge módosítása
                        const statusBadge = container.querySelector('.status_badge');
                        if (statusBadge) {
                            statusBadge.classList.remove('status_completed');
                            statusBadge.classList.add('status_uncompleted');
                            statusBadge.innerHTML = `
                                <span class="icon_text">Várakozó</span>
                                <img src="icons/hourglass.svg" alt="Várakozó" class="status_icon">
                            `;
                        }
                        
                        // Link módosítása
                        const link = container.querySelector('.own_completed_requests_link');
                        if (link) {
                            link.classList.remove('own_completed_requests_link');
                            link.classList.add('own_uncompleted_requests_link');
                        }
                        
                        // Container class módosítása
                        container.classList.remove('own_completed_request_container');
                        container.classList.add('own_uncompleted_request_container');
                        
                        // Törlés gomb hozzáadása, ha nincs
                        if (!container.querySelector('.content_delete_button')) {
                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'button small_button content_delete_button';
                            deleteButton.setAttribute('aria-label', 'Törlés');
                            deleteButton.innerHTML = `
                                <span class="icon_text">Törlés</span>
                                <img src="icons/delete.svg" alt="Törlés">
                            `;
                            container.insertBefore(deleteButton, container.querySelector('h2'));
                        }
                    }
                    
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült újraküldeni a kérelmet!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Kérelem újraküldési hiba:', error);
            alert('Hiba történt a kérelem újraküldése során: ' + error.message);
        }
    }
});

// =========================
// SZAVAZÁS (UPVOTE / DOWNVOTE)
// =========================

document.addEventListener('click', async function(e) {
    const upvoteButton = e.target.closest('.upvote_button');
    const downvoteButton = e.target.closest('.downvote_button');
    
    if (!upvoteButton && !downvoteButton) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const button = upvoteButton || downvoteButton;
    const voteType = upvoteButton ? 'up' : 'down';
    
    // Megkeressük az up_id-t - először a modalt próbáljuk, majd a voting_container-t, majd a content_container-t
    let upId = null;
    const modal = button.closest('.modal');
    const votingContainer = button.closest('.voting_container');
    const contentContainer = button.closest('.content_container');
    
    if (modal) {
        upId = modal.getAttribute('data-up-id');
    } else if (votingContainer) {
        upId = votingContainer.getAttribute('data-up-id');
    } else if (contentContainer) {
        upId = contentContainer.getAttribute('data-up-id');
    }
    
    if (!upId) {
        alert('Hiba: Nem található a fájl azonosítója!');
        return;
    }
    
    // Ha már aktív a gomb, akkor eltávolítjuk a szavazatot
    const isActive = button.classList.contains('active');
    const vote = isActive ? 'remove' : voteType;
    
    try {
        const response = await fetch('php/vote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ up_id: upId, vote: vote })
        });
        
        if (!response.ok) {
            throw new Error('Nem sikerült a szavazás.');
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Frissítjük a rating megjelenítést
            // Modalban
            if (modal) {
                const ratingElement = modal.querySelector('.data-file-rating');
                if (ratingElement) {
                    ratingElement.textContent = result.new_rating;
                }
            }
            // Content containerben
            if (votingContainer) {
                const voteCount = votingContainer.querySelector('.vote_count');
                if (voteCount) {
                    voteCount.textContent = result.new_rating;
                }
            }
            
            // Frissítjük a gombok állapotát
            const upBtn = votingContainer ? votingContainer.querySelector('.upvote_button') : null;
            const downBtn = votingContainer ? votingContainer.querySelector('.downvote_button') : null;
            
            if (upBtn) upBtn.classList.remove('active');
            if (downBtn) downBtn.classList.remove('active');
            
            if (result.user_vote === 1 && upBtn) {
                upBtn.classList.add('active');
            } else if (result.user_vote === -1 && downBtn) {
                downBtn.classList.add('active');
            }
            
            // Ha modálban szavaztunk, frissítsük a megfelelő content container-t is
            if (modal && upId) {
                const contentVotingContainers = document.querySelectorAll(`.voting_container[data-up-id="${upId}"]`);
                contentVotingContainers.forEach(container => {
                    const contentVoteCount = container.querySelector('.vote_count');
                    if (contentVoteCount) {
                        contentVoteCount.textContent = result.new_rating;
                    }
                    
                    const contentUpBtn = container.querySelector('.upvote_button');
                    const contentDownBtn = container.querySelector('.downvote_button');
                    
                    if (contentUpBtn) contentUpBtn.classList.remove('active');
                    if (contentDownBtn) contentDownBtn.classList.remove('active');
                    
                    if (result.user_vote === 1 && contentUpBtn) {
                        contentUpBtn.classList.add('active');
                    } else if (result.user_vote === -1 && contentDownBtn) {
                        contentDownBtn.classList.add('active');
                    }
                });
            }
        } else {
            alert('Hiba: ' + (result.error || 'Nem sikerült a szavazás!'));
        }
        
    } catch (error) {
        console.error('Szavazási hiba:', error);
        alert('Hiba történt a szavazás során: ' + error.message);
    }
});

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
async function downloadFile(upId) {
    try {
        showLoading('Letöltés indítása...');
        
        // Először növeljük a letöltések számát az adatbázisban
        const response = await fetch(`php/increment_download.php?up_id=${upId}`);
        const result = await response.json();
        
        if (result.success) {
            // Frissítjük a letöltés számlálót a modalban
            const modal = document.querySelector(`.modal[data-up-id="${upId}"]`);
            if (modal) {
                const downloadsElement = modal.querySelector('.data-file-downloads');
                if (downloadsElement) {
                    downloadsElement.textContent = result.new_downloads;
                }
            }
            
            // Frissítjük a letöltés számlálót a content containerben
            const contentContainer = document.querySelector(`.content_container[data-up-id="${upId}"]`);
            if (contentContainer) {
                const downloadsSpan = contentContainer.querySelector('.content_downloads span');
                if (downloadsSpan) {
                    // Megőrizzük a "letöltés" szöveget ha van
                    const hideableText = downloadsSpan.querySelector('.hideable_text');
                    if (hideableText) {
                        downloadsSpan.innerHTML = `${result.new_downloads}<span class="hideable_text"> letöltés</span>`;
                    } else {
                        downloadsSpan.textContent = result.new_downloads;
                    }
                }
            }
        }
        
        // Letöltés indítása (függetlenül a számláló frissítéstől)
        const downloadLink = document.createElement('a');
        downloadLink.href = `php/download_file.php?up_id=${upId}`;
        downloadLink.download = '';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => {
            hideLoading();
        }, 500);
        
    } catch (error) {
        console.error('Letöltési hiba:', error);
        hideLoading();
        
        // Még ha a számláló frissítés nem sikerül, megpróbáljuk a letöltést
        const downloadLink = document.createElement('a');
        downloadLink.href = `php/download_file.php?up_id=${upId}`;
        downloadLink.download = '';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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

        const newTitle = modal.querySelector('#fileTitle')?.value || '';
        const newDescription = modal.querySelector('#fileDescription')?.value || '';
        
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
                    // Fájl adatok frissítése a listában
                    const fileCard = document.querySelector(`.own_details_link[data-up-id="${upId}"]`)?.closest('.content_container');
                    if (fileCard) {
                        const titleElement = fileCard.querySelector('h2');
                        const descriptionElement = fileCard.querySelector('p');
                        if (titleElement) titleElement.textContent = newTitle;
                        if (descriptionElement) descriptionElement.textContent = newDescription;
                    }
                    
                    const editCloseButton = modal.querySelector('.edit_close_button');
                    if (editCloseButton) editCloseButton.click();
                    
                    // Ha nyitva a részletek modal
                    const detailsModal = document.querySelector('.own_file_details_modal');
                    if (detailsModal && !detailsModal.classList.contains('hidden')) {
                        const detailsCloseButton = detailsModal.querySelector('.modal_close_button');
                        if (detailsCloseButton) detailsCloseButton.click();
                    }
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
// KÉRELEM SZERKESZTÉS MENTÉSE
// =========================

const editRequestForm = document.getElementById('editRequestForm');
if (editRequestForm) {
    editRequestForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const modal = this.closest('.edit_request_modal');
        const requestId = modal ? modal.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosítója!');
            return;
        }

        const newTitle = modal.querySelector('#requestTitle')?.value || '';
        const newDescription = modal.querySelector('#requestDescription')?.value || '';
        
        const formData = new FormData(this);
        formData.append('request_id', requestId);
        
        try {
            showLoading('Kérelem módosítása...');
            
            const response = await fetch('php/edit_request.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült módosítani a kérelmet.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Kérelem adatok frissítése a listában
                    const requestCard = document.querySelector(`.own_uncompleted_requests_link[data-request-id="${requestId}"]`)?.closest('.content_container');
                    if (requestCard) {
                        const titleElement = requestCard.querySelector('h2');
                        const descriptionElement = requestCard.querySelector('p');
                        if (titleElement) titleElement.textContent = newTitle;
                        if (descriptionElement) descriptionElement.textContent = newDescription;
                    }
                    
                    const editCloseButton = modal.querySelector('.edit_close_button');
                    if (editCloseButton) editCloseButton.click();
                    
                    // Ha nyitva a részletek modal
                    const detailsModal = document.querySelector('.own_uncompleted_requests_modal');
                    if (detailsModal && !detailsModal.classList.contains('hidden')) {
                        const detailsCloseButton = detailsModal.querySelector('.modal_close_button');
                        if (detailsCloseButton) detailsCloseButton.click();
                    }
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült módosítani a kérelmet!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Kérelem módosítási hiba:', error);
            alert('Hiba történt a kérelem módosítása során: ' + error.message);
        }
    });
}

// =========================
// CHATSZOBA SZERKESZTÉS MENTÉSE
// =========================

const editChatroomForm = document.getElementById('editChatroomForm');
if (editChatroomForm) {
    editChatroomForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const modal = this.closest('.edit_chatroom_modal');
        const roomId = modal ? modal.getAttribute('data-room-id') : null;
        
        if (!roomId) {
            alert('Hiba: Nem található a chatszoba azonosítója!');
            return;
        }

        const newTitle = modal.querySelector('#chatroomTitle')?.value || '';
        const newDescription = modal.querySelector('#chatroomDescription')?.value || '';
        
        const formData = new FormData(this);
        formData.append('room_id', roomId);
        
        try {
            showLoading('Chatszoba módosítása...');
            
            const response = await fetch('php/edit_chatroom.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült módosítani a chatszobát.');
            }
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Chatszoba adatok frissítése a listában
                    const chatroomCard = document.querySelector(`.own_chatroom_container[data-room-id="${roomId}"], .chatroom_container[data-room-id="${roomId}"]`);
                    if (chatroomCard) {
                        const titleElement = chatroomCard.querySelector('h2');
                        const descriptionElement = chatroomCard.querySelector('p');
                        if (titleElement) titleElement.textContent = newTitle;
                        if (descriptionElement) descriptionElement.textContent = newDescription;
                    }
                    
                    const editCloseButton = modal.querySelector('.edit_close_button');
                    if (editCloseButton) editCloseButton.click();
                } else {
                    alert('Hiba: ' + (result.error || 'Nem sikerült módosítani a chatszobát!'));
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Chatszoba módosítási hiba:', error);
            alert('Hiba történt a chatszoba módosítása során: ' + error.message);
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
                    
                    // Ha kérelemhez töltöttünk fel, távolítsuk el a kérelmet a nézetből
                    if (result.request_id) {
                        // Keressük meg a kérelmet a listában és távolítsuk el
                        const requestContainers = document.querySelectorAll('.request_container, .own_uncompleted_request_container');
                        requestContainers.forEach(container => {
                            const link = container.querySelector('[data-request-id]');
                            if (link && link.getAttribute('data-request-id') == result.request_id) {
                                container.remove();
                            }
                        });
                    }
                    
                    // Új fájl kártya hozzáadása a listához (subject.php esetén)
                    if (window.location.pathname.includes('subject.php') && result.file) {
                        const fileSection = document.getElementById('subject_file_container');
                        if (fileSection) {
                            // Töröljük a "nincs fájl" üzenetet ha van
                            const noContentMsg = fileSection.querySelector('.no_content_message');
                            if (noContentMsg) noContentMsg.remove();
                            
                            // Saját fájl kártya hozzáadása az elejére
                            const file = result.file;
                            const escapeHtml = (text) => {
                                const div = document.createElement('div');
                                div.textContent = text;
                                return div.innerHTML;
                            };
                            
                            fileSection.insertAdjacentHTML('afterbegin', `
                                <div class="content_container uploaded_files_container">
                                    <a href="#" class="container_link own_details_link" data-up-id="${file.up_id}" aria-label="Fájl részletei"></a>
                                    <button class="button small_button content_download_button" aria-label="Letöltés">
                                        <span class="icon_text">Letöltés</span>
                                        <img src="icons/download.svg" alt="Letöltés">
                                    </button>
                                    <div class="content_downloads">
                                        <span>0<span class="hideable_text"> letöltés</span></span>
                                        <img src="icons/download.svg" alt="Letöltések">
                                    </div>
                                    <div class="content_voting voting_container hideable_content">
                                        <span class="vote_count">0</span>
                                        <img class="own_downvote_icon" src="icons/downvote.svg" alt="Nem tetszik">
                                        <img src="icons/upvote.svg" alt="Tetszik">
                                    </div>
                                    <h2>${escapeHtml(file.title)}</h2>
                                    <p>${escapeHtml(file.description)}</p>
                                    <p>Én, ${escapeHtml(file.upload_date)}</p>
                                </div>
                            `);
                        }
                    }
                    
                    // Form reset
                    uploadFileForm.reset();
                    
                    // Hidden request_id mező eltávolítása ha volt
                    const hiddenRequestInput = uploadFileForm.querySelector('input[name="request_id"]');
                    if (hiddenRequestInput) {
                        hiddenRequestInput.remove();
                    }
                    
                    // Modal bezárása
                    const modal = uploadFileForm.closest('.upload_file_modal');
                    if (modal) {
                        const closeButton = modal.querySelector('.upload_close_button');
                        if (closeButton) closeButton.click();
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
    const admin = document.getElementById('admin_page');
    if (!admin) return;

    // Statisztikák betöltése
    async function loadStatistics() {
        try {
            const response = await fetch('php/getStatistics.php');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a statisztikákat');
            }
            const data = await response.json();
            
            // Frissítjük a HTML elemeket
            const allUsersElem = document.getElementById('allUsers');
            const allSubjectsElem = document.getElementById('allSubjects');
            const allFilesElem = document.getElementById('allFiles');
            const allRequestsElem = document.getElementById('allRequests');
            const allChatroomsElem = document.getElementById('allChatrooms');
            
            if (allUsersElem) allUsersElem.textContent = `Összes felhasználó: ${data.allUsers || 0}`;
            if (allSubjectsElem) allSubjectsElem.textContent = `Aktív tárgyak: ${data.allSubjects || 0}`;
            if (allFilesElem) allFilesElem.textContent = `Feltöltött fájlok: ${data.allFiles || 0}`;
            if (allRequestsElem) allRequestsElem.textContent = `Függő kérelmek: ${data.allRequests || 0}`;
            if (allChatroomsElem) allChatroomsElem.textContent = `Aktív chatszobák: ${data.allChatrooms || 0}`;
        } catch (error) {
            console.error('Hiba a statisztikák betöltésekor:', error);
        }
    }

    // Statisztikák betöltése oldal betöltésekor
    loadStatistics();

    // Legutóbbi aktivitások betöltése és megjelenítése
    let latestActivitiesData = null;

    async function loadLatestActivities() {
        try {
            const response = await fetch('php/getLatestActivities.php');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a legutóbbi aktivitásokat');
            }
            latestActivitiesData = await response.json();
            displayLatestActivities('files');
        } catch (error) {
            console.error('Hiba a legutóbbi aktivitások betöltésekor:', error);
        }
    }

    function displayLatestActivities(type) {
        const container = document.getElementById('latest_activities_container');
        if (!container || !latestActivitiesData) return;

        container.innerHTML = '';
        const activities = latestActivitiesData[type] || [];

        if (activities.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincs megjeleníthető aktivitás</p>';
            return;
        }

        activities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'content_container';
            
            // Link hozzáadása típus alapján
            if (type === 'files') {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'container_link file_details_link';
                link.setAttribute('data-up-id', activity.id);
                link.setAttribute('aria-label', 'Fájl részletei');
                activityDiv.appendChild(link);
            } else if (type === 'chatrooms') {
                const link = document.createElement('a');
                link.href = `chatroom.php?room_id=${activity.id}`;
                link.className = 'container_link chatroom_link';
                link.setAttribute('aria-label', 'Chatszoba megnyitása');
                activityDiv.appendChild(link);
            }

            // Törlés gomb hozzáadása
            const deleteButton = document.createElement('button');
            deleteButton.className = 'button small_button top_right_button';
            deleteButton.setAttribute('aria-label', 'Törlés');
            if (type === 'files') {
                deleteButton.classList.add('file_delete_button');
                deleteButton.setAttribute('data-file-id', activity.id);
            } else if (type === 'requests') {
                deleteButton.classList.add('request_delete_button');
                deleteButton.setAttribute('data-request-id', activity.id);
            } else if (type === 'chatrooms') {
                deleteButton.classList.add('chatroom_delete_button');
                deleteButton.setAttribute('data-chatroom-id', activity.id);
            }
            
            const deleteImg = document.createElement('img');
            deleteImg.src = 'icons/delete.svg';
            deleteImg.alt = 'Törlés';
            
            const deleteSpan = document.createElement('span');
            deleteSpan.className = 'icon_text';
            deleteSpan.textContent = 'Törlés';
            
            deleteButton.appendChild(deleteImg);
            deleteButton.appendChild(deleteSpan);
            activityDiv.appendChild(deleteButton);
            
            const title = document.createElement('h3');
            title.textContent = activity.title;
            
            const description = document.createElement('p');
            description.textContent = activity.description;
            
            const meta = document.createElement('p');
            if (activity.create_date) {
                const dateFormatted = new Date(activity.create_date).toLocaleDateString('hu-HU');
                meta.textContent = `${activity.creator}, ${dateFormatted}`;
            } else {
                meta.textContent = activity.creator;
            }
            
            activityDiv.appendChild(title);
            activityDiv.appendChild(description);
            activityDiv.appendChild(meta);
            
            container.appendChild(activityDiv);
        });
    }

    // Legutóbbi aktivitások betöltése
    loadLatestActivities();

    // Radio gombok szűrés kezelése
    const latestFilesRadio = document.getElementById('latestFiles');
    const latestRequestsRadio = document.getElementById('latestRequests');
    const latestChatroomsRadio = document.getElementById('latestChatrooms');

    if (latestFilesRadio) {
        latestFilesRadio.addEventListener('change', () => {
            if (latestFilesRadio.checked) {
                displayLatestActivities('files');
            }
        });
    }

    if (latestRequestsRadio) {
        latestRequestsRadio.addEventListener('change', () => {
            if (latestRequestsRadio.checked) {
                displayLatestActivities('requests');
            }
        });
    }

    if (latestChatroomsRadio) {
        latestChatroomsRadio.addEventListener('change', () => {
            if (latestChatroomsRadio.checked) {
                displayLatestActivities('chatrooms');
            }
        });
    }

    // Jelentések betöltése és megjelenítése
    let reportsData = null;

    async function loadReports() {
        try {
            const response = await fetch('php/getReports.php');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a jelentéseket');
            }
            const data = await response.json();
            if (data.success) {
                reportsData = data.reports;
                displayReports('all');
            }
        } catch (error) {
            console.error('Hiba a jelentések betöltésekor:', error);
        }
    }

    function displayReports(filter) {
        const container = document.getElementById('reported_items_container');
        if (!container || !reportsData) return;

        container.innerHTML = '';
        
        const filteredReports = filter === 'all' 
            ? reportsData 
            : reportsData.filter(report => report.reported_table === filter);

        if (filteredReports.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincs megjeleníthető jelentés</p>';
            return;
        }

        filteredReports.forEach(report => {
            const reportDiv = document.createElement('div');
            reportDiv.className = 'content_container';
            
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'container_link reported_item_link';
            link.setAttribute('data-report-id', report.report_id);
            link.setAttribute('data-report-type', report.reported_table);
            link.setAttribute('aria-label', 'Jelentés részletei');
            reportDiv.appendChild(link);

            const title = document.createElement('h3');
            title.textContent = report.item_name || 'Törölt elem';

            const reason = document.createElement('p');
            reason.textContent = report.report_description;

            const meta = document.createElement('p');
            meta.textContent = `${report.reporter_name} (${report.report_neptun})`;

            reportDiv.appendChild(title);
            reportDiv.appendChild(reason);
            reportDiv.appendChild(meta);

            container.appendChild(reportDiv);
        });
    }

    loadReports();

    // Jelentések szűrés kezelése
    const reportedAllRadio = document.getElementById('reportedAll');
    const reportedFilesRadio = document.getElementById('reportedFiles');
    const reportedRequestsRadio = document.getElementById('reportedRequests');
    const reportedChatroomsRadio = document.getElementById('reportedChatrooms');

    if (reportedAllRadio) {
        reportedAllRadio.addEventListener('change', () => {
            if (reportedAllRadio.checked) {
                displayReports('all');
            }
        });
    }

    if (reportedFilesRadio) {
        reportedFilesRadio.addEventListener('change', () => {
            if (reportedFilesRadio.checked) {
                displayReports('upload');
            }
        });
    }

    if (reportedRequestsRadio) {
        reportedRequestsRadio.addEventListener('change', () => {
            if (reportedRequestsRadio.checked) {
                displayReports('request');
            }
        });
    }

    if (reportedChatroomsRadio) {
        reportedChatroomsRadio.addEventListener('change', () => {
            if (reportedChatroomsRadio.checked) {
                displayReports('chatroom');
            }
        });
    }

    // Jelentett elem megnyitása
    document.addEventListener('click', async (e) => {
        const reportLink = e.target.closest('.reported_item_link');
        if (!reportLink) return;
        
        e.preventDefault();
        const reportId = reportLink.getAttribute('data-report-id');
        const reportType = reportLink.getAttribute('data-report-type');
        
        const report = reportsData.find(r => r.report_id == reportId);
        if (!report) return;

        if (reportType === 'upload') {
            const modal = document.querySelector('.reported_file_details_modal');
            if (modal) {
                modal.setAttribute('data-up-id', report.reported_id);
                modal.setAttribute('data-report-id', report.report_id);
                modal.setAttribute('data-creator-neptun', report.item_creator_neptun || '');
                modal.querySelector('.data-report-title').textContent = report.item_name || 'Nincs megadva';
                modal.querySelector('.data-report-name').textContent = report.file_name || 'Nincs megadva';
                modal.querySelector('.data-report-uploader').textContent = `${report.item_creator_name} (${report.item_creator_neptun})`;
                modal.querySelector('.data-report-description').textContent = report.item_description || 'Nincs leírás';
                modal.querySelector('.data-report-reporter').textContent = `${report.reporter_name} (${report.reporter_neptun})`;
                modal.querySelector('.data-report-reason').textContent = report.report_description;
                modal.classList.remove('hidden');
            }
        } else if (reportType === 'chatroom') {
            const modal = document.querySelector('.reported_chatroom_details_modal');
            if (modal) {
                modal.setAttribute('data-room-id', report.reported_id);
                modal.setAttribute('data-report-id', report.report_id);
                modal.setAttribute('data-creator-neptun', report.item_creator_neptun || '');
                modal.querySelector('.data-report-title').textContent = report.item_name || 'Nincs megadva';
                modal.querySelector('.data-report-creator').textContent = `${report.item_creator_name} (${report.item_creator_neptun || 'N/A'})`;
                modal.querySelector('.data-report-description').textContent = report.item_description || 'Nincs leírás';
                modal.querySelector('.data-report-reporter').textContent = `${report.reporter_name} (${report.reporter_neptun})`;
                modal.querySelector('.data-report-reason').textContent = report.report_description;
                modal.classList.remove('hidden');
            }
        } else if (reportType === 'request') {
            const modal = document.querySelector('.reported_request_details_modal');
            if (modal) {
                modal.setAttribute('data-request-id', report.reported_id);
                modal.setAttribute('data-report-id', report.report_id);
                modal.setAttribute('data-creator-neptun', report.item_creator_neptun || '');
                modal.querySelector('.data-report-title').textContent = report.item_name || 'Nincs megadva';
                modal.querySelector('.data-report-requester').textContent = `${report.item_creator_name} (${report.item_creator_neptun})`;
                modal.querySelector('.data-report-description').textContent = report.item_description || 'Nincs leírás';
                modal.querySelector('.data-report-reporter').textContent = `${report.reporter_name} (${report.reporter_neptun})`;
                modal.querySelector('.data-report-reason').textContent = report.report_description;
                modal.classList.remove('hidden');
            }
        }
    });
    
    // Felhasználók betöltése és megjelenítése
    async function loadUsers() {
        const container = document.getElementById('user_list_container');
        if (!container) return;

        try {
            const response = await fetch('php/getUsers.php');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a felhasználókat');
            }
            const users = await response.json();

            container.innerHTML = '';

            if (users.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincsenek felhasználók</p>';
                return;
            }

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'content_container admin_container admin_user_container';

                const title = document.createElement('h3');
                title.textContent = `${user.full_name} (${user.nickname})`;

                const neptun = document.createElement('p');
                neptun.textContent = user.neptun;

                const placeholder = document.createElement('p');
                placeholder.textContent = "";

                const email = document.createElement('p');
                email.textContent = user.email;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'button small_button admin_button user_delete_button';
                deleteButton.setAttribute('data-neptun', user.neptun);
                deleteButton.setAttribute('aria-label', 'Felhasználó törlése');

                const deleteImg = document.createElement('img');
                deleteImg.src = 'icons/delete.svg';
                deleteImg.alt = 'Törlés';

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'icon_text';
                deleteSpan.textContent = 'Törlés';

                deleteButton.appendChild(deleteImg);
                deleteButton.appendChild(deleteSpan);

                userDiv.appendChild(title);
                userDiv.appendChild(deleteButton);
                userDiv.appendChild(neptun);
                userDiv.appendChild(placeholder);
                userDiv.appendChild(email);

                container.appendChild(userDiv);
            });
        } catch (error) {
            console.error('Hiba a felhasználók betöltésekor:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Hiba történt a betöltés során</p>';
        }
    }

    // Felhasználók kezelése modal megnyitása
    const manageUsersButton = document.getElementById('manageUsersButton');
    if (manageUsersButton) {
        manageUsersButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Felhasználók betöltése...");
            loadUsers().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const adminUsersModal = document.querySelector('.admin_user_modal');
                    if (adminUsersModal) {
                        adminUsersModal.classList.remove('hidden');
                    }  
                }, 500);
            });
        });
    }

    // Tárgyak betöltése és megjelenítése
    async function loadAllSubjects() {
        const container = document.getElementById('subject_list_container');
        if (!container) return;

        try {
            const response = await fetch('php/getAllSubjects.php');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a tárgyakat');
            }
            const subjects = await response.json();

            container.innerHTML = '';

            if (subjects.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincsenek tárgyak</p>';
                return;
            }

            subjects.forEach(subject => {
                const subjectDiv = document.createElement('div');
                subjectDiv.className = 'content_container admin_container admin_subject_container';

                const link = document.createElement('a');
                link.href = `subject.php?class_code=${encodeURIComponent(subject.class_code)}`;
                link.className = 'container_link subject_link';
                link.setAttribute('aria-label', 'Tárgy megnyitása');
                subjectDiv.appendChild(link);

                const title = document.createElement('h2');
                title.textContent = subject.class_name;

                const editButton = document.createElement('button');
                editButton.className = 'button small_button admin_button subject_edit_button';
                editButton.setAttribute('data-class-code', subject.class_code);
                editButton.setAttribute('aria-label', 'Tárgy szerkesztése');

                const editImg = document.createElement('img');
                editImg.src = 'icons/edit.svg';
                editImg.alt = 'Szerkesztés';

                const editSpan = document.createElement('span');
                editSpan.className = 'icon_text';
                editSpan.textContent = 'Szerkesztés';

                editButton.appendChild(editImg);
                editButton.appendChild(editSpan);

                const code = document.createElement('p');
                code.textContent = subject.class_code;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'button small_button admin_button subject_delete_button';
                deleteButton.setAttribute('data-class-code', subject.class_code);
                deleteButton.setAttribute('aria-label', 'Tárgy törlése');

                const deleteImg = document.createElement('img');
                deleteImg.src = 'icons/delete.svg';
                deleteImg.alt = 'Törlés';

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'icon_text';
                deleteSpan.textContent = 'Törlés';

                deleteButton.appendChild(deleteImg);
                deleteButton.appendChild(deleteSpan);

                subjectDiv.appendChild(title);
                subjectDiv.appendChild(editButton);
                subjectDiv.appendChild(code);
                subjectDiv.appendChild(deleteButton);

                container.appendChild(subjectDiv);
            });
        } catch (error) {
            console.error('Hiba a tárgyak betöltésekor:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Hiba történt a betöltés során</p>';
        }
    }

    // Tárgyak kezelése modal megnyitása
    const manageSubjectsButton = document.getElementById('manageSubjectsButton');
    if (manageSubjectsButton) {
        manageSubjectsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Tárgyak betöltése...");
            loadAllSubjects().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const adminSubjectsModal = document.querySelector('.admin_subject_modal');
                    if (adminSubjectsModal) {
                        adminSubjectsModal.classList.remove('hidden');
                    }  
                }, 500);
            });
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
            
            const container = editSubjectButton.closest('.admin_subject_container');
            const subjectName = container.querySelector('h2')?.textContent || '';
            const subjectCode = container.querySelector('p')?.textContent || '';
            
            const editModal = document.querySelector('.admin_edit_subject_modal');
            if (editModal) {
                // Form mezők kitöltése
                const nameInput = editModal.querySelector('#editSubjectName');
                const codeInput = editModal.querySelector('#editSubjectCode');
                
                if (nameInput) nameInput.value = subjectName;
                if (codeInput) codeInput.value = subjectCode;
                
                // Eredeti kód tárolása data attribútumban (a szerkesztés azonosításához)
                editModal.setAttribute('data-original-code', subjectCode);
                
                editModal.classList.remove('hidden');
            }
        }
    });

    async function loadAllFiles() {
        const container = document.getElementById('file_list_container');
        if (!container) return;

        try {
            const response = await fetch('php/getFileDetails.php?mode=all');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a fájlokat');
            }
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Hiba a fájlok betöltésekor');
            }

            container.innerHTML = '';

            if (data.files.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincsenek fájlok</p>';
                return;
            }

            data.files.forEach(file => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'content_container admin_container admin_file_container';

                const link = document.createElement('a');
                link.href = '#';
                link.className = 'container_link file_details_link';
                link.setAttribute('data-up-id', file.up_id);
                link.setAttribute('aria-label', 'Fájl részletei');
                fileDiv.appendChild(link);

                const title = document.createElement('h2');
                title.textContent = file.title;

                const downloadButton = document.createElement('button');
                downloadButton.className = 'button small_button admin_button file_download_button';
                downloadButton.setAttribute('data-file-id', file.up_id);
                downloadButton.setAttribute('aria-label', 'Fájl letöltése');

                const downloadImg = document.createElement('img');
                downloadImg.src = 'icons/download.svg';
                downloadImg.alt = 'Letöltés';

                const downloadSpan = document.createElement('span');
                downloadSpan.className = 'icon_text';
                downloadSpan.textContent = 'Letöltés';

                downloadButton.appendChild(downloadImg);
                downloadButton.appendChild(downloadSpan);

                const uploader = document.createElement('p');
                uploader.textContent = file.upload_date ? `${file.uploader}, ${file.upload_date}` : file.uploader;

                const emptyP = document.createElement('p');

                const description = document.createElement('p');
                description.textContent = file.description || 'Nincs leírás';

                const deleteButton = document.createElement('button');
                deleteButton.className = 'button small_button admin_button file_delete_button';
                deleteButton.setAttribute('data-file-id', file.up_id);
                deleteButton.setAttribute('aria-label', 'Fájl törlése');

                const deleteImg = document.createElement('img');
                deleteImg.src = 'icons/delete.svg';
                deleteImg.alt = 'Törlés';

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'icon_text';
                deleteSpan.textContent = 'Törlés';

                deleteButton.appendChild(deleteImg);
                deleteButton.appendChild(deleteSpan);

                fileDiv.appendChild(title);
                fileDiv.appendChild(downloadButton);
                fileDiv.appendChild(uploader);
                fileDiv.appendChild(emptyP);
                fileDiv.appendChild(description);
                fileDiv.appendChild(deleteButton);

                container.appendChild(fileDiv);
            });
        } catch (error) {
            console.error('Hiba a fájlok betöltésekor:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Hiba történt a betöltés során</p>';
        }
    }

    // Fájlok kezelése modal megnyitása
    const manageFilesButton = document.getElementById('manageFilesButton');
    if (manageFilesButton) {
        manageFilesButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Fájlok betöltése...");
            loadAllFiles().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const adminFilesModal = document.querySelector('.admin_files_modal');
                    if (adminFilesModal) {
                        adminFilesModal.classList.remove('hidden');
                    }  
                }, 500);
            });
        });
    }

    async function loadAllRequests() {
        const container = document.getElementById('request_list_container');
        if (!container) return;

        try {
            const response = await fetch('php/getRequests.php?mode=all');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a kérelmeket');
            }
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Hiba a kérelmek betöltésekor');
            }

            container.innerHTML = '';

            if (data.requests.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincsenek kérelmek</p>';
                return;
            }

            data.requests.forEach(request => {
                const requestDiv = document.createElement('div');
                requestDiv.className = 'content_container admin_container admin_request_container';

                const title = document.createElement('h2');
                title.textContent = request.request_name;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'button small_button admin_button request_delete_button';
                deleteButton.setAttribute('data-request-id', request.request_id);
                deleteButton.setAttribute('aria-label', 'Kérelem törlése');

                const deleteImg = document.createElement('img');
                deleteImg.src = 'icons/delete.svg';
                deleteImg.alt = 'Törlés';

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'icon_text';
                deleteSpan.textContent = 'Törlés';

                deleteButton.appendChild(deleteImg);
                deleteButton.appendChild(deleteSpan);

                const requester = document.createElement('p');
                requester.textContent = request.request_date ? `${request.requester_nickname}, ${request.request_date}` : request.requester_nickname;

                const emptyP = document.createElement('p');

                const description = document.createElement('p');
                description.textContent = request.description || 'Nincs leírás';

                requestDiv.appendChild(title);
                requestDiv.appendChild(deleteButton);
                requestDiv.appendChild(requester);
                requestDiv.appendChild(emptyP);
                requestDiv.appendChild(description);

                container.appendChild(requestDiv);
            });
        } catch (error) {
            console.error('Hiba a kérelmek betöltésekor:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Hiba történt a betöltés során</p>';
        }
    }

    // Kérelmek kezelése modal megnyitása
    const manageRequestsButton = document.getElementById('manageRequestsButton');
    if (manageRequestsButton) {
        manageRequestsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Kérelmek betöltése...");
            loadAllRequests().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const adminRequestsModal = document.querySelector('.admin_requests_modal');
                    if (adminRequestsModal) {
                        adminRequestsModal.classList.remove('hidden');
                    }  
                }, 500);
            });
        });
    }

    async function loadAllChatrooms() {
        const container = document.getElementById('chatroom_list_container');
        if (!container) return;

        try {
            const response = await fetch('php/getChatrooms.php?mode=all');
            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a chatszobákat');
            }
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Hiba a chatszobák betöltésekor');
            }

            container.innerHTML = '';

            if (data.chatrooms.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">Nincsenek chatszobák</p>';
                return;
            }

            data.chatrooms.forEach(chatroom => {
                const chatroomDiv = document.createElement('div');
                chatroomDiv.className = 'content_container admin_container admin_chatroom_container';

                const link = document.createElement('a');
                link.href = `chatroom.php?room_id=${encodeURIComponent(chatroom.room_id)}`;
                link.className = 'container_link chatroom_link';
                link.setAttribute('aria-label', 'Chatszoba megnyitása');
                chatroomDiv.appendChild(link);

                const title = document.createElement('h2');
                title.textContent = chatroom.title;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'button small_button admin_button chatroom_delete_button';
                deleteButton.setAttribute('data-chatroom-id', chatroom.room_id);
                deleteButton.setAttribute('aria-label', 'Chatszoba törlése');

                const deleteImg = document.createElement('img');
                deleteImg.src = 'icons/delete.svg';
                deleteImg.alt = 'Törlés';

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'icon_text';
                deleteSpan.textContent = 'Törlés';

                deleteButton.appendChild(deleteImg);
                deleteButton.appendChild(deleteSpan);

                const creator = document.createElement('p');
                creator.textContent = chatroom.create_date ? `${chatroom.creater_nickname}, ${chatroom.create_date}` : chatroom.creater_nickname;

                const emptyP = document.createElement('p');

                const description = document.createElement('p');
                description.textContent = chatroom.description || 'Nincs leírás';

                chatroomDiv.appendChild(title);
                chatroomDiv.appendChild(deleteButton);
                chatroomDiv.appendChild(creator);
                chatroomDiv.appendChild(emptyP);
                chatroomDiv.appendChild(description);

                container.appendChild(chatroomDiv);
            });
        } catch (error) {
            console.error('Hiba a chatszobák betöltésekor:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Hiba történt a betöltés során</p>';
        }
    }

    // Chatszobák kezelése modal megnyitása
    const manageChatroomsButton = document.getElementById('manageChatroomsButton');
    if (manageChatroomsButton) {
        manageChatroomsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading("Chatszobák betöltése...");
            loadAllChatrooms().then(() => {
                setTimeout(() => {
                    hideLoading();
                    const adminChatroomsModal = document.querySelector('.admin_chatrooms_modal');
                    if (adminChatroomsModal) {
                        adminChatroomsModal.classList.remove('hidden');
                    }  
                }, 500);
            });
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

    // =========================
    // ADMIN FÁJL LETÖLTÉSE
    // =========================
    document.addEventListener('click', function(e) {
        const downloadButton = e.target.closest('.admin_file_container .file_download_button');
        if (!downloadButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const fileId = downloadButton.getAttribute('data-file-id');
        if (!fileId) {
            alert('Hiba: Nem található a fájl azonosító!');
            return;
        }
        
        // Letöltés indítása
        downloadFile(fileId);
    });

    // =========================
    // ADMIN FÁJL TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.admin_file_container .file_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const fileId = deleteButton.getAttribute('data-file-id');
        if (!fileId) {
            alert('Hiba: Nem található a fájl azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    up_id: fileId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a fájl elemet a listából
                    const fileContainer = deleteButton.closest('.admin_file_container');
                    if (fileContainer) {
                        fileContainer.remove();
                    }
                    // Frissítjük a latestActivitiesData-t és reportsData-t
                    if (latestActivitiesData && latestActivitiesData.files) {
                        latestActivitiesData.files = latestActivitiesData.files.filter(f => f.id != fileId);
                        displayLatestActivities('files');
                    }
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'upload' && r.reported_id == fileId));
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // ADMIN KÉRELEM TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.admin_request_container .request_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const requestId = deleteButton.getAttribute('data-request-id');
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
            return;
        }
        
        try {
            showLoading('Kérelem törlése...');
            
            const response = await fetch('php/delete_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    request_id: requestId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a kérelem elemet a listából
                    const requestContainer = deleteButton.closest('.admin_request_container');
                    if (requestContainer) {
                        requestContainer.remove();
                    }
                    // Frissítjük a latestActivitiesData-t és reportsData-t
                    if (latestActivitiesData && latestActivitiesData.requests) {
                        latestActivitiesData.requests = latestActivitiesData.requests.filter(r => r.id != requestId);
                        displayLatestActivities('requests');
                    }
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'request' && r.reported_id == requestId));
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // ADMIN CHATSZOBA TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.admin_chatroom_container .chatroom_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const chatroomId = deleteButton.getAttribute('data-chatroom-id');
        if (!chatroomId) {
            alert('Hiba: Nem található a chatszoba azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a chatszobát?')) {
            return;
        }
        
        try {
            showLoading('Chatszoba törlése...');
            
            const response = await fetch('php/delete_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    room_id: chatroomId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a chatszoba elemet a listából
                    const chatroomContainer = deleteButton.closest('.admin_chatroom_container');
                    if (chatroomContainer) {
                        chatroomContainer.remove();
                    }
                    // Frissítjük a latestActivitiesData-t és reportsData-t
                    if (latestActivitiesData && latestActivitiesData.chatrooms) {
                        latestActivitiesData.chatrooms = latestActivitiesData.chatrooms.filter(c => c.id != chatroomId);
                        displayLatestActivities('chatrooms');
                    }
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'chatroom' && r.reported_id == chatroomId));
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // ADMIN FELHASZNÁLÓ TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.admin_user_container .user_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const neptun = deleteButton.getAttribute('data-neptun');
        if (!neptun) {
            alert('Hiba: Nem található a felhasználó azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót? Ez törli az összes feltöltését, kérelmét, chatszobáját és üzenetét is!')) {
            return;
        }
        
        try {
            showLoading('Felhasználó törlése...');
            
            const response = await fetch('php/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    neptun: neptun
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a felhasználó elemet a listából
                    const userContainer = deleteButton.closest('.admin_user_container');
                    if (userContainer) {
                        userContainer.remove();
                    }
                    // Frissítjük a latestActivitiesData-t és reportsData-t
                    if (typeof loadLatestActivities === 'function') {
                        loadLatestActivities();
                    }
                    if (typeof loadReports === 'function') {
                        loadReports();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // ADMIN TÁRGY TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.admin_subject_container .subject_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const classCode = deleteButton.getAttribute('data-class-code');
        if (!classCode) {
            alert('Hiba: Nem található a tárgy azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a tárgyat? Ez törli az összes hozzá tartozó feltöltést, kérelmet, chatszobát és üzenetet is!')) {
            return;
        }
        
        try {
            showLoading('Tárgy törlése...');
            
            const response = await fetch('php/delete_subject.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    class_code: classCode,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a tárgy elemet a listából
                    const subjectContainer = deleteButton.closest('.admin_subject_container');
                    if (subjectContainer) {
                        subjectContainer.remove();
                    }
                    // Frissítjük a latestActivitiesData-t és reportsData-t
                    if (typeof loadLatestActivities === 'function') {
                        loadLatestActivities();
                    }
                    if (typeof loadReports === 'function') {
                        loadReports();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // LATEST ACTIVITIES TÖRLÉS
    // =========================
    
    // Legutóbbi aktivitások - Fájl törlése
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('#latest_activities_container .file_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const fileId = deleteButton.getAttribute('data-file-id');
        if (!fileId) {
            alert('Hiba: Nem található a fájl azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    up_id: fileId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a fájlt a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.files) {
                        latestActivitiesData.files = latestActivitiesData.files.filter(f => f.id != fileId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'upload' && r.reported_id == fileId));
                    }
                    const container = deleteButton.closest('.content_container');
                    if (container) {
                        container.remove();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // Legutóbbi aktivitások - Kérelem törlése
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('#latest_activities_container .request_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const requestId = deleteButton.getAttribute('data-request-id');
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
            return;
        }
        
        try {
            showLoading('Kérelem törlése...');
            
            const response = await fetch('php/delete_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    request_id: requestId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a kérelmet a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.requests) {
                        latestActivitiesData.requests = latestActivitiesData.requests.filter(r => r.id != requestId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'request' && r.reported_id == requestId));
                    }
                    const container = deleteButton.closest('.content_container');
                    if (container) {
                        container.remove();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // Legutóbbi aktivitások - Chatszoba törlése
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('#latest_activities_container .chatroom_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const chatroomId = deleteButton.getAttribute('data-chatroom-id');
        if (!chatroomId) {
            alert('Hiba: Nem található a chatszoba azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a chatszobát?')) {
            return;
        }
        
        try {
            showLoading('Chatszoba törlése...');
            
            const response = await fetch('php/delete_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    room_id: chatroomId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    // Eltávolítjuk a chatszobát a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.chatrooms) {
                        latestActivitiesData.chatrooms = latestActivitiesData.chatrooms.filter(c => c.id != chatroomId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'chatroom' && r.reported_id == chatroomId));
                    }
                    const container = deleteButton.closest('.content_container');
                    if (container) {
                        container.remove();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // FILE DETAILS MODAL TÖRLÉS
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.file_details_modal .delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.file_details_modal');
        const fileId = modal ? modal.getAttribute('data-up-id') : null;
        
        if (!fileId) {
            alert('Hiba: Nem található a fájl azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    up_id: fileId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a fájlt a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.files) {
                        latestActivitiesData.files = latestActivitiesData.files.filter(f => f.id != fileId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'upload' && r.reported_id == fileId));
                    }
                    // Fríssítjük a legutóbbi aktivitásokat
                    displayLatestActivities('files');
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - FÁJL TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_file_details_modal .delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_file_details_modal');
        const fileId = modal ? modal.getAttribute('data-up-id') : null;
        
        if (!fileId) {
            alert('Hiba: Nem található a fájl azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
            return;
        }
        
        try {
            showLoading('Fájl törlése...');
            
            const response = await fetch('php/delete_file.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    up_id: fileId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a fájlt a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.files) {
                        latestActivitiesData.files = latestActivitiesData.files.filter(f => f.id != fileId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'upload' && r.reported_id == fileId));
                    }
                    // Fríssítjük a jelentéseket
                    displayReports('all');
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - KÉRELEM TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_request_details_modal .delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_request_details_modal');
        const requestId = modal ? modal.getAttribute('data-request-id') : null;
        
        if (!requestId) {
            alert('Hiba: Nem található a kérelem azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
            return;
        }
        
        try {
            showLoading('Kérelem törlése...');
            
            const response = await fetch('php/delete_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    request_id: requestId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a kérelmet a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.requests) {
                        latestActivitiesData.requests = latestActivitiesData.requests.filter(r => r.id != requestId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'request' && r.reported_id == requestId));
                    }
                    // Fríssítjük a jelentéseket
                    displayReports('all');
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - CHATSZOBA TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_chatroom_details_modal .delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_chatroom_details_modal');
        const chatroomId = modal ? modal.getAttribute('data-room-id') : null;
        
        if (!chatroomId) {
            alert('Hiba: Nem található a chatszoba azonosító!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a chatszobát?')) {
            return;
        }
        
        try {
            showLoading('Chatszoba törlése...');
            
            const response = await fetch('php/delete_chatroom.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    room_id: chatroomId,
                    admin_mode: true
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a chatszobát a latestActivitiesData-ból is
                    if (latestActivitiesData && latestActivitiesData.chatrooms) {
                        latestActivitiesData.chatrooms = latestActivitiesData.chatrooms.filter(c => c.id != chatroomId);
                    }
                    // Eltávolítjuk a reportsData-ból is
                    if (reportsData) {
                        reportsData = reportsData.filter(r => !(r.reported_table === 'chatroom' && r.reported_id == chatroomId));
                    }
                    // Fríssítjük a jelentéseket
                    displayReports('all');
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - FÁJL FELTÖLTŐ TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_file_details_modal .user_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_file_details_modal');
        const creatorNeptun = modal ? modal.getAttribute('data-creator-neptun') : null;
        
        if (!creatorNeptun) {
            alert('Hiba: Nem található a feltöltő azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót? Ez törli az összes feltöltését, kérelmét, chatszobáját és üzenetét is!')) {
            return;
        }
        
        try {
            showLoading('Felhasználó törlése...');
            
            const response = await fetch('php/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    neptun: creatorNeptun
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Frissítjük az összes adatot
                    if (typeof loadLatestActivities === 'function') {
                        loadLatestActivities();
                    }
                    if (typeof loadReports === 'function') {
                        loadReports();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - KÉRELMEZŐ TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_request_details_modal .user_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_request_details_modal');
        const creatorNeptun = modal ? modal.getAttribute('data-creator-neptun') : null;
        
        if (!creatorNeptun) {
            alert('Hiba: Nem található a kérelmező azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót? Ez törli az összes feltöltését, kérelmét, chatszobáját és üzenetét is!')) {
            return;
        }
        
        try {
            showLoading('Felhasználó törlése...');
            
            const response = await fetch('php/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    neptun: creatorNeptun
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Frissítjük az összes adatot
                    if (typeof loadLatestActivities === 'function') {
                        loadLatestActivities();
                    }
                    if (typeof loadReports === 'function') {
                        loadReports();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - CHATSZOBA LÉTREHOZÓ TÖRLÉSE
    // =========================
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.reported_chatroom_details_modal .user_delete_button');
        if (!deleteButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = deleteButton.closest('.reported_chatroom_details_modal');
        const creatorNeptun = modal ? modal.getAttribute('data-creator-neptun') : null;
        
        if (!creatorNeptun) {
            alert('Hiba: Nem található a létrehozó azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót? Ez törli az összes feltöltését, kérelmét, chatszobáját és üzenetét is!')) {
            return;
        }
        
        try {
            showLoading('Felhasználó törlése...');
            
            const response = await fetch('php/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    neptun: creatorNeptun
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Frissítjük az összes adatot
                    if (typeof loadLatestActivities === 'function') {
                        loadLatestActivities();
                    }
                    if (typeof loadReports === 'function') {
                        loadReports();
                    }
                } else {
                    alert(result.error || 'Hiba történt a törlés során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a törlés során!');
        }
    });

    // =========================
    // REPORT MODAL - JELENTÉS LEZÁRÁSA (FÁJL)
    // =========================
    document.addEventListener('click', async function(e) {
        const closeButton = e.target.closest('.reported_file_details_modal .finish_report_button');
        if (!closeButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = closeButton.closest('.reported_file_details_modal');
        const reportId = modal ? modal.getAttribute('data-report-id') : null;
        
        if (!reportId) {
            alert('Hiba: Nem található a jelentés azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan le szeretnéd zárni ezt a jelentést?')) {
            return;
        }
        
        try {
            showLoading('Jelentés lezárása...');
            
            const response = await fetch('php/close_report.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    report_id: reportId
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a jelentést a reportsData-ból
                    if (reportsData) {
                        reportsData = reportsData.filter(r => r.report_id != reportId);
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a lezárás során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a lezárás során!');
        }
    });

    // =========================
    // REPORT MODAL - JELENTÉS LEZÁRÁSA (KÉRELEM)
    // =========================
    document.addEventListener('click', async function(e) {
        const closeButton = e.target.closest('.reported_request_details_modal .finish_report_button');
        if (!closeButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = closeButton.closest('.reported_request_details_modal');
        const reportId = modal ? modal.getAttribute('data-report-id') : null;
        
        if (!reportId) {
            alert('Hiba: Nem található a jelentés azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan le szeretnéd zárni ezt a jelentést?')) {
            return;
        }
        
        try {
            showLoading('Jelentés lezárása...');
            
            const response = await fetch('php/close_report.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    report_id: reportId
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a jelentést a reportsData-ból
                    if (reportsData) {
                        reportsData = reportsData.filter(r => r.report_id != reportId);
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a lezárás során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a lezárás során!');
        }
    });

    // =========================
    // REPORT MODAL - JELENTÉS LEZÁRÁSA (CHATSZOBA)
    // =========================
    document.addEventListener('click', async function(e) {
        const closeButton = e.target.closest('.reported_chatroom_details_modal .finish_report_button');
        if (!closeButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = closeButton.closest('.reported_chatroom_details_modal');
        const reportId = modal ? modal.getAttribute('data-report-id') : null;
        
        if (!reportId) {
            alert('Hiba: Nem található a jelentés azonosítója!');
            return;
        }
        
        if (!confirm('Biztosan le szeretnéd zárni ezt a jelentést?')) {
            return;
        }
        
        try {
            showLoading('Jelentés lezárása...');
            
            const response = await fetch('php/close_report.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    report_id: reportId
                })
            });
            
            const result = await response.json();
            
            setTimeout(() => {
                hideLoading();
                
                if (result.success) {
                    modal.classList.add('hidden');
                    // Eltávolítjuk a jelentést a reportsData-ból
                    if (reportsData) {
                        reportsData = reportsData.filter(r => r.report_id != reportId);
                        displayReports('all');
                    }
                } else {
                    alert(result.error || 'Hiba történt a lezárás során!');
                }
            }, 1250);
            
        } catch (error) {
            hideLoading();
            console.error('Hiba:', error);
            alert('Hiba történt a lezárás során!');
        }
    });

    // =========================
    // REPORT MODAL - CHATSZOBA MEGTEKINTÉSE
    // =========================
    document.addEventListener('click', function(e) {
        const viewButton = e.target.closest('.reported_chatroom_details_modal .view_button');
        if (!viewButton) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const modal = viewButton.closest('.reported_chatroom_details_modal');
        const roomId = modal ? modal.getAttribute('data-room-id') : null;
        
        if (!roomId) {
            alert('Hiba: Nem található a chatszoba azonosítója!');
            return;
        }
        
        // Átirányítás a chatszoba oldalra
        window.location.href = `chatroom.php?room_id=${roomId}`;
    });

})();
// ==========================================
// 1. ALAPVETŐ SEGÉDFÜGGVÉNYEK (Loading, stb.)
// ==========================================

function showLoading(message = 'Betöltés...') {
    let loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    const loadingText = loadingScreen.querySelector('.loading-text');
    if (loadingText) loadingText.textContent = message;
    
    loadingScreen.classList.add('active');
    loadingScreen.classList.remove('hidden'); // Biztos ami biztos
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            // Ha ez az első betöltés (initial), vegyük ki a DOM-ból vagy rejtsük el
            if (loadingScreen.classList.contains('initial-loading')) {
                loadingScreen.style.display = 'none'; 
            }
        }, 500);
    }
}

// Oldal betöltésekor eltüntetjük a töltőképernyőt
window.onload = function() {
    hideLoading();
};

// 2. FŐ LOGIKA (DOM BETÖLTÉS UTÁN)

document.addEventListener('DOMContentLoaded', function() {
    console.log("Scripts.js betöltve - Tiszta lap.");

    // Globális változók a jelentéshez
    let currentReportType = '';
    let currentReportId = 0;

    // A) Modal bezárás (X gombok és háttér)
    
    // Gombok
    const closeButtons = document.querySelectorAll('.modal_close_button, .report_close_button');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal');
            if (modal) modal.classList.add('hidden');
        });
    });

    // Háttérre kattintás
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // B) Fájl részletek megnyitása

    document.body.addEventListener('click', async function(e) {
        // Keressük a fájl részletek linket/kártyát
        const link = e.target.closest('.file_details_link') || e.target.closest('.uploaded_files_container a.container_link');
        
        // Csak akkor fut, ha NEM saját fájlra kattintasz (sajátnál 'own_details_link' van)
        if (link && !link.classList.contains('own_details_link')) {
            e.preventDefault();
            
            const upId = link.getAttribute('data-up-id');
            if (!upId) return; // Ha nincs ID, nem csinálunk semmit

            showLoading('Fájl adatok betöltése...');

            try {
                // PHP hívás a részletekért
                const response = await fetch(`php/getFileDetails.php?mode=upload&id=${upId}`);
                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    const modal = document.querySelector('.file_details_modal');
                    
                    if (modal) {
                        // BEÁLLÍTJUK AZ ID-T A MODALRA (Ez kritikus a jelentéshez!)
                        modal.setAttribute('data-up-id', data.up_id);

                        // Kitöltjük az adatokat (Cím, leírás, stb.)
                        if(modal.querySelector('.data-file-title')) modal.querySelector('.data-file-title').textContent = data.title;
                        if(modal.querySelector('.data-file-uploader')) modal.querySelector('.data-file-uploader').textContent = data.uploader;
                        if(modal.querySelector('.data-file-name')) modal.querySelector('.data-file-name').textContent = data.file_name;
                        if(modal.querySelector('.data-file-description')) modal.querySelector('.data-file-description').textContent = data.description;
                        
                        // Megnyitjuk a modalt
                        setTimeout(() => {
                            hideLoading();
                            modal.classList.remove('hidden');
                        }, 500);
                    }
                } else {
                    hideLoading();
                    alert("Hiba: " + result.message);
                }
            } catch (error) {
                hideLoading();
                console.error(error);
                alert("Hálózati hiba a fájl megnyitásakor.");
            }
        }
    });
    // JELENTÉS FUNKCIÓ - Gombnyo
   
    document.body.addEventListener('click', function(e) {
        const reportBtn = e.target.closest('.report_button');
        
        if (reportBtn) {
            e.preventDefault();
            console.log("Jelentés gomb megnyomva.");

            // Reset
            currentReportType = '';
            currentReportId = 0;

            // 1. Megnézzük, hogy MODAL-ban vagyunk-e (pl. Részletek ablak)
            const parentModal = reportBtn.closest('.modal');
            
            if (parentModal) {
                if (parentModal.hasAttribute('data-up-id')) {
                    currentReportType = 'upload';
                    currentReportId = parentModal.getAttribute('data-up-id');
                } else if (parentModal.hasAttribute('data-request-id')) {
                    currentReportType = 'request';
                    currentReportId = parentModal.getAttribute('data-request-id');
                } else if (parentModal.hasAttribute('data-room-id')) {
                    currentReportType = 'chatroom';
                    currentReportId = parentModal.getAttribute('data-room-id');
                }
            }

            // 2. Ha nem modalban találtuk, megnézzük a KÁRTYÁT (Lista nézet)
            if (!currentReportId) {
                const card = reportBtn.closest('.content_container');
                if (card) {
                    // A) Kérelem (Request)
                    // A kérelem ID-ja gyakran a benne lévő link attribútumában van
                    const reqLink = card.querySelector('[data-request-id]');
                    if (reqLink) {
                        currentReportType = 'request';
                        currentReportId = reqLink.getAttribute('data-request-id');
                    }
                    // B) Chatszoba (Chatroom)
                    // A chatszoba ID-ja magán a konténeren szokott lenni
                    else if (card.hasAttribute('data-room-id')) {
                        currentReportType = 'chatroom';
                        currentReportId = card.getAttribute('data-room-id');
                    }
                    // C) Fájl (Upload)
                    // Ritka, de ha listából jelentjük
                    else if (card.querySelector('[data-up-id]')) {
                        currentReportType = 'upload';
                        currentReportId = card.querySelector('[data-up-id]').getAttribute('data-up-id');
                    }
                }
            }

            console.log("Azonosítva:", currentReportType, currentReportId);
            
            // Ha sikerült azonosítani, nyitjuk a jelentés ablakot
            if (currentReportType && currentReportId) {
                const reportModal = document.querySelector('.report_content_modal');
                if (reportModal) {
                    // Töröljük az előző szöveget
                    const textarea = reportModal.querySelector('#report_description');
                    if(textarea) textarea.value = '';
                    
                    reportModal.classList.remove('hidden');
                }
            } else {
                alert("Hiba: Nem sikerült azonosítani az elemet (ID nem található)!");
            }
        }
    });

    // JELENTÉS BEKÜLDÉSE
    const reportForm = document.getElementById('reportContentForm');
    
    if (reportForm) {
        reportForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // NE TÖLTSÖN ÚJRA AZ OLDAL!
            
            if (!currentReportType || !currentReportId) {
                alert("Hiba: Hiányzó adatok! Indítsd újra a folyamatot.");
                return;
            }

            const formData = new FormData(this);
            formData.append('item_type', currentReportType);
            formData.append('item_id', currentReportId);

            try {
                showLoading("Jelentés küldése...");
                
                const response = await fetch('php/submit_report.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                setTimeout(() => {
                    hideLoading();
                    if (result.success) {
                        alert("Sikeres jelentés!");
                        // Bezárjuk a modalt
                        document.querySelector('.report_content_modal').classList.add('hidden');
                    } else {
                        alert("Hiba: " + result.error);
                    }
                }, 500);

            } catch (error) {
                hideLoading();
                console.error("Fetch hiba:", error);
                alert("Szerver hiba történt!");
            }
        });
    }

});
    // ÚJ KÉRELEM KEZELÉSE

    // 1. Modal megnyitása
    document.body.addEventListener('click', function(e) {
        // Megkeressük a gombot (add_request_button)
        const addBtn = e.target.closest('.add_request_button');
        if (addBtn) {
            e.preventDefault();
            const modal = document.querySelector('.add_request_modal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        }
    });

    // 2. Űrlap beküldése
    const addRequestForm = document.getElementById('add_request_form');
    
    if (addRequestForm) {
        addRequestForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Megállítjuk az oldal újratöltést
            
            // Kiolvassuk a tárgy kódját az URL-ből 
            const urlParams = new URLSearchParams(window.location.search);
            const classCode = urlParams.get('class_code');
            
            if (!classCode) {
                alert('Hiba: Nem található a tárgy kódja az URL-ben!');
                return;
            }

            // Adatok összegyűjtése
            const formData = new FormData(this);
            formData.append('class_code', classCode); // Hozzácsapjuk a kódot

            try {
                showLoading('Kérelem létrehozása...');
                
                const response = await fetch('php/add_request.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                setTimeout(() => {
                    hideLoading();
                    if (result.success) {
                        alert(result.message);
                        // Bezárjuk a modalt
                        document.querySelector('.request_close_button').click();
                        // Töröljük a mezőket
                        addRequestForm.reset();
                        // Frissítjük az oldalt, hogy látszódjon az új kérelem
                        location.reload();
                    } else {
                        alert('Hiba: ' + result.error);
                    }
                }, 500);
                
            } catch (error) {
                hideLoading();
                console.error('Hiba:', error);
                alert('Hálózati hiba történt!');
            }
        });
    }
    // ÚJ CHATSZOBA KEZELÉSE


    // 1. Modal megnyitása
    document.body.addEventListener('click', function(e) {
        const addBtn = e.target.closest('.add_chatroom_button');
        if (addBtn) {
            e.preventDefault();
            const modal = document.querySelector('.add_chatroom_modal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        }
    });

    // 2. Űrlap beküldése
    const addChatroomForm = document.getElementById('add_chatroom_form');
    if (addChatroomForm) {
        addChatroomForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const urlParams = new URLSearchParams(window.location.search);
            const classCode = urlParams.get('class_code');
            
            if (!classCode) {
                alert('Hiba: Nem található a tárgy kódja az URL-ben!');
                return;
            }

            const formData = new FormData(this);
            formData.append('class_code', classCode);

            try {
                showLoading('Chatszoba létrehozása...');
                
                const response = await fetch('php/add_chatroom.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                setTimeout(() => {
                    hideLoading();
                    if (result.success) {
                        alert(result.message);
                        document.querySelector('.chatroom_close_button').click();
                        addChatroomForm.reset();
                        location.reload();
                    } else {
                        alert('Hiba: ' + result.error);
                    }
                }, 500);
                
            } catch (error) {
                hideLoading();
                console.error('Hiba:', error);
                alert('Hálózati hiba történt!');
            }
        });
    }

    // ADMIN: TÁRGYAK KEZELÉSE
 

    // Csak akkor fusson, ha az admin oldalon vagyunk
    if (document.getElementById('admin_page')) {

        // 1. Új tárgy hozzáadása
        const addSubjectForm = document.getElementById('addSubjectForm');
        if (addSubjectForm) {
            addSubjectForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                formData.append('action', 'add');

                try {
                    showLoading("Mentés...");
                    const response = await fetch('php/admin_subject_handler.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    setTimeout(() => {
                        hideLoading();
                        if (result.success) {
                            alert(result.message);
                            location.reload(); // Frissítés, hogy látsszon a listában
                        } else {
                            alert("Hiba: " + result.error);
                        }
                    }, 500);
                } catch (error) {
                    hideLoading();
                    console.error(error);
                }
            });
        }

        // 2. Tárgy szerkesztése - Modal megnyitása és adatok betöltése
        // (Mivel a gombok dinamikusan jöhetnek létre, a document-re tesszük a figyelőt)
        document.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.subject_edit_button');
            if (editBtn) {
                e.preventDefault();
                
                // Adatok kinyerése a kártyából
                const container = editBtn.closest('.admin_subject_container');
                const name = container.querySelector('h2').textContent;
                const code = container.querySelector('p').textContent;

                const modal = document.querySelector('.admin_edit_subject_modal');
                if (modal) {
                    // Mezők kitöltése
                    modal.querySelector('#editSubjectName').value = name;
                    modal.querySelector('#editSubjectCode').value = code;
                    
                    // Eredeti kód mentése (hogy tudjuk, mit módosítunk)
                    modal.setAttribute('data-original-code', code);
                    
                    modal.classList.remove('hidden');
                }
            }
        });

        // 3. Szerkesztés mentése
        const editSubjectForm = document.getElementById('editSubjectForm');
        if (editSubjectForm) {
            editSubjectForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const modal = this.closest('.modal');
                const originalCode = modal.getAttribute('data-original-code');

                const formData = new FormData(this);
                formData.append('action', 'edit');
                formData.append('original_class_code', originalCode);

                try {
                    showLoading("Frissítés...");
                    const response = await fetch('php/admin_subject_handler.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    setTimeout(() => {
                        hideLoading();
                        if (result.success) {
                            alert(result.message);
                            location.reload();
                        } else {
                            alert("Hiba: " + result.error);
                        }
                    }, 500);
                } catch (error) {
                    hideLoading();
                    console.error(error);
                }
            });
        }
    }