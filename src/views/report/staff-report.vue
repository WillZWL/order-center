<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        客服业绩对比分析报表
                    </p>
                    <Form :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="8">
                                <FormItem label="客服">
                                    <Select placeholder="请选择客服">                                       
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="订单开始日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单开始日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="订单结束日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单结束日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>                       
                        </Row>
                        <Row>
                            <Col span="9" offset="9">              
                                <Button type="primary" class="margin-right-10">客服销售汇总统计表</Button>                                                         
                                <Button type="primary">客服销售明细表</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
