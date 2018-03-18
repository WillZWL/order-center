<template>
  <div>
    <base-order :type="type"></base-order>
  </div>
</template>
<script>

import baseOrder from './base-order.vue';

export default {
  name: 'purchase-order',
  components: {
    baseOrder, 
  },
  data () {
    return {
      type: 1,
    }
  }
}
</script>
