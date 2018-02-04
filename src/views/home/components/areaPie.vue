<template>
    <div style="width:100%;height:100%;" id="area_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('area_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['广州', '武汉', '北京', '郑州', '南京']
                },
                series: [
                    {
                        name: '销售额',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 5200, name: '广州', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: 5200, name: '武汉', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: 5200, name: '北京', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: 5200, name: '郑州', itemStyle: {normal: {color: '#ab8df2'}}},
                            {value: 5200, name: '南京', itemStyle: {normal: {color: '#ab8df2'}}},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
    }
};
</script>
