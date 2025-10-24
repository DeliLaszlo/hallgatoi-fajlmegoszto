document.addEventListener('DOMContentLoaded', function() {
    // Sötét mód váltó
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark_mode');
        }
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark_mode');
            if (document.body.classList.contains('dark_mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

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
            const addSubjectModal = document.querySelector('.add_subject_modal');
            if (addSubjectModal) {
                addSubjectModal.classList.remove('hidden');
            }
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

    // Fájl részletei modal megnyitása
    document.addEventListener('click', function(e) {
    if (e.target.closest('.file_details_link')) {
        e.preventDefault();
        const fileDetailsModal = document.querySelector('.file_details_modal');
        if (fileDetailsModal) {
            fileDetailsModal.classList.remove('hidden');
        }
    }
    });

    // Saját fájl részletei modal megnyitása
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
// ===== Chatszoba: delegált, robusztus eseménykezelés =====
(() => {
  // Globális hibafigyelő – ha bármi JS-hiba megakasztaná a kódot, itt látod:
  window.addEventListener('error', (e) => {
    console.warn('[Chat] JS error:', e.message, e.filename, e.lineno, e.colno);
  });

  // Gyakran használt elemek (ha később kerülnek a DOM-ba, ismét lekérjük szükség esetén)
  const Q = (sel, root = document) => root.querySelector(sel);
  const QA = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Chat gyökér – ha nincs chatszoba, a kód csendben kiszáll
  const root = () => Q('#subject_chatszobak');
  const els = () => ({
    convList: Q('#chat_conv_list'),
    messages: Q('#chat_messages'),
    text:     Q('#chat_text'),
    composer: Q('#chat_composer'),
    inviteBtn: Q('#chat_invite_btn'),
    newConvBtn: Q('#chat_new_conv'),
    deleteConvBtn: Q('#chat_delete_conv'),
    clearBtn: Q('#chat_clear_btn'),
    search: Q('#chat_search'),
    roomTitle: Q('#chat_room_title'),
    roomAvatar: Q('#chat_room_avatar'),
    autoscroll: Q('#chat_autoscroll'),
  });

  if (!root()) return; // nincs chatszoba ezen az oldalon

  // Egyszerű állapot a frontendhez
  const state = {
    activeId: '',
    rooms: {} // id -> { id, title, messages: [{author,text,ts,me}] }
  };

  const pad = (n) => String(n).padStart(2, '0');
  const nowStamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const initials = (name) => {
    if (!name) return 'B';
    const p = name.trim().split(/\s+/);
    return ((p[0]||'')[0]||'').toUpperCase() + ((p[1]||'')[0]||'').toUpperCase();
  };
  const slugify = (name) => (name || 'room')
    .toLowerCase()
    .replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i').replace(/[óòôöő]/g, 'o')
    .replace(/[úùûüű]/g, 'u').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'room';

  function scrollToBottom() {
    const e = els();
    if (e.autoscroll && e.autoscroll.checked && e.messages) {
      e.messages.scrollTop = e.messages.scrollHeight;
    }
  }

  function renderMessages(id) {
    const e = els();
    const room = state.rooms[id];
    if (!e.messages || !room) return;
    e.messages.innerHTML = '';
    room.messages.forEach(m => {
      const row = document.createElement('div');
      row.className = 'chat_row ' + (m.me ? 'me' : 'other');
      row.innerHTML = `
        <div class="chat_bubble ${m.me ? 'me' : ''}">
          <div>${m.text}</div>
          <div class="chat_meta">${m.author} • ${m.ts}</div>
        </div>`;
      e.messages.appendChild(row);
    });
    scrollToBottom();
  }

  function setActiveRoom(id) {
    const e = els();
    state.activeId = id;
    // lista vizuális jelölés
    if (e.convList) {
      QA('.chat_list_item', e.convList).forEach(li => {
        li.classList.toggle('active', li.dataset.id === id);
      });
    }
    const room = state.rooms[id];
    if (e.roomTitle)  e.roomTitle.textContent = room?.title || 'Beszélgetés';
    if (e.roomAvatar) e.roomAvatar.textContent = initials(room?.title || 'B');
    renderMessages(id);
  }

  // Kezdeti beolvasás a DOM-ból
  (function bootstrapFromDOM() {
    const e = els();
    if (e.convList) {
      QA('.chat_list_item', e.convList).forEach((li, idx) => {
        const title = (Q('strong', li)?.textContent || `Szoba ${idx+1}`).trim();
        const id = (li.dataset.id = (li.dataset.id || (idx === 0 ? 'general' : slugify(title))));
        if (!state.rooms[id]) state.rooms[id] = { id, title, messages: [] };
        if (li.classList.contains('active')) state.activeId = id;
      });
    }
    if (!state.activeId) {
      // ha nincs aktív kijelölés, válaszd az elsőt
      const first = e.convList ? Q('.chat_list_item', e.convList) : null;
      state.activeId = first ? (first.dataset.id || 'general') : 'general';
    }
    // kezdeti üzenetek a DOM-ból (ha vannak)
    if (e.messages && state.rooms[state.activeId]) {
      QA('.chat_row', e.messages).forEach(row => {
        const me = row.classList.contains('me');
        const bubble = Q('.chat_bubble', row);
        const text = (Q('div:not(.chat_meta)', bubble)?.textContent || '').trim();
        const meta = (Q('.chat_meta', bubble)?.textContent || '').trim();
        let author = 'Ismeretlen', ts = nowStamp();
        const m = meta.match(/^(.+)\s+•\s+(.+)$/);
        if (m) { author = m[1]; ts = m[2]; }
        state.rooms[state.activeId].messages.push({ author, text, ts, me });
      });
    }
    // első render
    setActiveRoom(state.activeId);
  })();

  // ===== Delegált kattintáskezelő – MINDEN gomb egy helyen =====
  document.addEventListener('click', (ev) => {
    if (!root()) return;

    const e = els();
    const target = ev.target;

    // Küldés gomb (ha a formon kívül lenne külön gomb)
    if (target.closest && target.closest('#chat_send')) {
      ev.preventDefault();
      sendMessage();
      return;
    }

    // Tisztítás
    if (target.closest && target.closest('#chat_clear_btn')) {
      ev.preventDefault();
      if (!state.rooms[state.activeId]) return;
      if (confirm('Biztosan törlöd az üzeneteket ebben a beszélgetésben?')) {
        state.rooms[state.activeId].messages = [];
        if (e.messages) e.messages.innerHTML = '';
      }
      return;
    }

    // Új beszélgetés
    if (target.closest && target.closest('#chat_new_conv')) {
      ev.preventDefault();
      const name = prompt('Új beszélgetés neve:');
      if (!name) return;
      const id = slugify(name);
      if (state.rooms[id]) { alert('Már létezik ilyen nevű beszélgetés.'); return; }
      state.rooms[id] = { id, title: name, messages: [] };
      if (e.convList) {
        const li = document.createElement('div');
        li.className = 'chat_list_item';
        li.dataset.id = id;
        li.innerHTML = `
          <div class="chat_avatar">${initials(name)}</div>
          <div>
            <div><strong>${name}</strong></div>
            <div class="no_content_message" style="font-size:.8rem;">#${id}</div>
          </div>`;
        e.convList.appendChild(li);
      }
      setActiveRoom(id);
      return;
    }

    // Beszélgetés törlése
    if (target.closest && target.closest('#chat_delete_conv')) {
      ev.preventDefault();
      const id = state.activeId;
      const room = state.rooms[id];
      if (!room) return;
      if (!confirm(`Törlöd a(z) "${room.title}" beszélgetést?`)) return;
      // listából törlés
      if (els().convList) {
        const li = Q(`.chat_list_item[data-id="${id}"]`, els().convList);
        if (li) li.remove();
      }
      delete state.rooms[id];
      // következő aktív
      const first = els().convList ? Q('.chat_list_item', els().convList) : null;
      if (first) setActiveRoom(first.dataset.id);
      else {
        if (els().roomTitle) els().roomTitle.textContent = 'Beszélgetés';
        if (els().roomAvatar) els().roomAvatar.textContent = 'B';
        if (els().messages) els().messages.innerHTML = '';
        state.activeId = '';
      }
      return;
    }

    // Meghívás
    if (target.closest && target.closest('#chat_invite_btn')) {
      ev.preventDefault();
      const who = prompt('Kit hívjunk meg? (név vagy e-mail)');
      if (who) alert(`Meghívó elküldve: ${who}`);
      return;
    }

    // Listaelem aktiválása
    const li = target.closest && target.closest('#chat_conv_list .chat_list_item');
    if (li && els().convList && els().convList.contains(li)) {
      ev.preventDefault();
      setActiveRoom(li.dataset.id);
      return;
    }
  });

  // Keresés a beszélgetéslistában (input esemény)
  document.addEventListener('input', (ev) => {
    const input = ev.target;
    if (!input || !input.matches || !input.matches('#chat_search')) return;
    const q = input.value.trim().toLowerCase();
    const e = els();
    if (!e.convList) return;
    QA('.chat_list_item', e.convList).forEach(li => {
      const title = (Q('strong', li)?.textContent || '').toLowerCase();
      const tag = (Q('.no_content_message', li)?.textContent || '').toLowerCase();
      li.style.display = (title.includes(q) || tag.includes(q)) ? '' : 'none';
    });
  });

  // Üzenetküldés (űrlap submit)
  function sendMessage() {
    const e = els();
    if (!e.text || !state.activeId || !state.rooms[state.activeId]) return;
    const txt = (e.text.value || '').trim();
    if (!txt) return;
    const msg = { author: 'Én', text: txt, ts: nowStamp(), me: true };
    state.rooms[state.activeId].messages.push(msg);

    if (e.messages) {
      const row = document.createElement('div');
      row.className = 'chat_row me';
      row.innerHTML = `
        <div class="chat_bubble me">
          <div>${msg.text}</div>
          <div class="chat_meta">${msg.author} • ${msg.ts}</div>
        </div>`;
      e.messages.appendChild(row);
    }
    e.text.value = '';
    scrollToBottom();
  }

  document.addEventListener('submit', (ev) => {
    const form = ev.target;
    if (!form || !form.matches || !form.matches('#chat_composer')) return;
    ev.preventDefault();
    sendMessage();
  });
})();

});