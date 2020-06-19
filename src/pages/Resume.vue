<template>
  <div/>
</template>

<script>
export default {
  created() {
    if (process.isClient) {
      location.replace('https://drive.google.com/file/d/1ofCriSzyvJxrIyNWgpyUnEsVcvKHoUbu/view?usp=sharing');
    }
  },
};
</script>

<style>
</style>
