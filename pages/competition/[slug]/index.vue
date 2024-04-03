<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug
navigateTo(`/competition/${slug}/register`)
</script>