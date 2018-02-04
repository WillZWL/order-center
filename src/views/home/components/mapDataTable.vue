<template>
    <div :style="styleObj">
        <Table :height="height" :columns="columns" :data="cityData"></Table>
    </div>
</template>

<script>
export default {
    name: 'mapDataTable',
    data () {
        return {
            columns: [
                {
                    title: '城市',
                    key: 'name'
                },
                {
                    title: '数量',
                    key: 'quantity'
                },
                {
                    title: '销售额',
                    key: 'value',
                }
            ]
        };
    },
    props: {
        cityData: Array,
        styleObj: Object,
        height: String
    }
};
</script>
