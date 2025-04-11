class AffiliateProgram {
    constructor() {
        this.initializeElements();
        this.initializeAffiliateLink();
        this.setupEventListeners();
        this.loadAffiliateStats();
        this.initializeReferralSystem();
    }

    initializeElements() {
        this.affiliateLinkInput = document.getElementById('affiliateLink');
        this.copyAffiliateButton = document.getElementById('copyAffiliateLink');
        this.totalReferralsEl = document.getElementById('totalReferrals');
        this.referralEarningsEl = document.getElementById('referralEarnings');
    }

    initializeAffiliateLink() {
        let userId = localStorage.getItem('userId');
        
        if (!userId) {
            userId = this.generateUniqueId();
            localStorage.setItem('userId', userId);
        }

        const baseUrl = window.location.origin;
        const affiliateLink = `${baseUrl}?ref=${userId}`;
        
        this.affiliateLinkInput.value = affiliateLink;
    }

    setupEventListeners() {
        this.copyAffiliateButton.addEventListener('click', () => this.copyAffiliateLink());
    }

    copyAffiliateLink() {
        this.affiliateLinkInput.select();
        document.execCommand('copy');
        
        this.copyAffiliateButton.textContent = '¡Copiado!';
        
        // Optional: Trigger a small visual feedback
        this.copyAffiliateButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.copyAffiliateButton.style.transform = 'scale(1)';
            this.copyAffiliateButton.textContent = 'Copiar';
        }, 2000);
    }

    generateUniqueId() {
        return 'af_' + Math.random().toString(36).substr(2, 9);
    }

    loadAffiliateStats() {
        const totalReferrals = localStorage.getItem('totalReferrals') || 0;
        const referralEarnings = localStorage.getItem('referralEarnings') || '0.00';

        this.totalReferralsEl.textContent = totalReferrals;
        this.referralEarningsEl.textContent = referralEarnings;
    }

    updateReferralStats(newReferrals, newEarnings) {
        localStorage.setItem('totalReferrals', newReferrals);
        localStorage.setItem('referralEarnings', newEarnings.toFixed(2));
        
        this.totalReferralsEl.textContent = newReferrals;
        this.referralEarningsEl.textContent = newEarnings.toFixed(2);
    }

    initializeReferralSystem() {
        // Check for referral in URL
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode && referralCode !== this.getUserId()) {
            this.processReferral(referralCode);
        }
    }

    processReferral(referrerId) {
        // Logic to track referral
        let referrals = parseInt(localStorage.getItem('totalReferrals') || '0');
        referrals++;
        
        localStorage.setItem('totalReferrals', referrals.toString());
        this.totalReferralsEl.textContent = referrals;
    }

    getUserId() {
        return localStorage.getItem('userId');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AffiliateProgram();
});