<template>
    <footer class="footer">
        <div class="container">
            <span v-html="settings.footer + currentYear" />
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            settings: require("../../data/theme.json"),
            currentYear: new Date().getFullYear()
        }
    },
    created() {
        this.interval = setInterval(() => this.currentYear = new Date().getFullYear(), 1000*60)
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>

<style scoped>
.footer {
    font-size: 0.8rem;
    padding: 6rem 0 3rem 0;
}
</style>
