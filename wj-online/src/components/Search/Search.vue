<template>
  <div class="Search">
    <div class="Search-inner">
      <slot name="Search-col"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="less">
.Search {
  position: relative;
  width: 1280px;
  height: 110px;
  margin: 140px auto 0 auto;
  background: #e9f0f7;
  border-radius: 10px;
  padding: 15px 0 0 20px;
  box-sizing: border-box;

  .Search-inner {
    width: 1106px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .Search-btn {
    position: absolute;
    height: 48px;
    right: 85px;
    top: 59%;
    transform: translateY(-50%);
  }
}
</style>