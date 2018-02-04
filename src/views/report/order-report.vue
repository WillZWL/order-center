<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        订单统计报表
                    </p>
                    <Form :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="12">
                                <FormItem label="订单开始日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单开始日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="订单结束日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单结束日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>                       
                        </Row>
                        <Row>
                            <Col span="8" offset="9">              
                                <Button type="primary" class="margin-right-10">每月订单销售统计</Button>                                                         
                                <Button type="primary">每年订单销售统计</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
