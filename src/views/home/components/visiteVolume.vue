<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
            let yAxisData = [];
            let data1 = [];
            let data2 = [];
            for (let i = 0; i < 20; i++) {
                yAxisData.push('类目' + i);
                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            }

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                series: [
                    {
                        name: '销售额',
                        type: 'bar',
                        data: [
                            {value: 45368, name: 'Mon', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 87954, name: 'Tues', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 23546, name: 'Wed', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 15984, name: 'Thur', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 54323, name: 'Fri', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 13059, name: 'Sat', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 11034, name: 'Sun', itemStyle: {normal: {color: '#2d8cf0'}}}
                        ]
                    }
                ]
            };

            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        });
    }
};
</script>
