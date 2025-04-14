<script>
    // Component state
    let domain = "";
    let fromName = "";
    let replyToEmail = "";
    let dnsVerified = false;

    // Handle form submission
    function saveConfiguration() {
        // Implementation for saving configuration
        console.log("Saving configuration for:", domain);
    }

    // Check DNS verification
    function checkDnsVerification() {
        // Mock implementation - would be an API call in real app
        console.log("Checking DNS for:", domain);
        // Set to true after actual verification
        dnsVerified = true;
    }
</script>

<div class="setup-container">
    <h1>Connect Your Email Domain</h1>

    <p class="intro">
        Configure our service to send emails using your domain name.
    </p>

    <form on:submit|preventDefault={saveConfiguration}>
        <!-- Step 1: Basic Info -->
        <div class="form-section">
            <h2>Domain Information</h2>

            <div class="form-group">
                <label for="domain">Your Domain</label>
                <input
                    type="text"
                    id="domain"
                    bind:value={domain}
                    placeholder="yourdomain.com"
                    required
                />
            </div>

            <div class="form-group">
                <label for="fromName">Default Sender Name</label>
                <input
                    type="text"
                    id="fromName"
                    bind:value={fromName}
                    placeholder="Your Company"
                />
            </div>

            <div class="form-group">
                <label for="replyTo">Default Reply-To</label>
                <input
                    type="email"
                    id="replyTo"
                    bind:value={replyToEmail}
                    placeholder="contact@yourdomain.com"
                />
            </div>
        </div>

        <!-- Step 2: DNS Setup -->
        <div class="form-section">
            <h2>DNS Configuration</h2>
            <p>Add these records to your domain's DNS settings:</p>

            <div class="dns-record">
                <strong>SPF Record (TXT)</strong><br />
                Host: @<br />
                Value: v=spf1 include:mailservice.com ~all
            </div>

            <div class="dns-record">
                <strong>DKIM Record (CNAME)</strong><br />
                Host: mail._domainkey<br />
                Value: dkim.mailservice.com
            </div>

            <button
                type="button"
                class="secondary-button"
                on:click={checkDnsVerification}
            >
                Verify DNS
            </button>

            {#if dnsVerified}
                <div class="verification-success">
                    ✓ Your domain is verified
                </div>
            {:else}
                <div class="verification-pending">⟳ Verification pending</div>
            {/if}
        </div>

        <button type="submit" class="primary-button">
            Activate Email Service
        </button>
    </form>
</div>

<style>
    .setup-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 15px;
    }

    h2 {
        color: #3498db;
        font-size: 18px;
        margin: 20px 0 10px 0;
    }

    .intro {
        margin-bottom: 25px;
        color: #555;
    }

    .form-section {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 6px;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .dns-record {
        background-color: #f0f0f0;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 10px;
        font-family: monospace;
        font-size: 14px;
    }

    .primary-button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
    }

    .secondary-button {
        background-color: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }

    .verification-success {
        color: #27ae60;
        margin-top: 10px;
        font-weight: 500;
    }

    .verification-pending {
        color: #e67e22;
        margin-top: 10px;
        font-weight: 500;
    }
</style>
