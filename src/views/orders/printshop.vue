<template>
    <Col span="24" class="margin-top-10">
        <Card>
            <p slot="title">
                印刷工艺: &nbsp;&nbsp;
                <CheckboxGroup style="display: inline-block;" v-model="chooseTech">
                    <Checkbox v-for="technique in techniqueList" :value="technique.name" :key="technique.name" :label="technique.name"></Checkbox>
                </CheckboxGroup>
            </p>
            <Row>
                <Col v-for="tech in chooseTech" :key="tech" span="24">
                    <Row v-if="tech === '丝网印'">
                        <Col span="8">
                            <FormItem  label="印刷厂">
                                <Select v-model="addOrderForm.printshop_1" placeholder="请选择印刷厂">
                                    <Option v-for="printshop in printShops" v-if="printshop.type === 4" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem  label="印刷费" prop="date">
                                <Input v-model.number="addOrderForm.printshop_1_cost" placeholder="印刷费"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4" offset='4'>
                            <Upload action="//jsonplaceholder.typicode.com/posts/">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传效果图</Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row v-if="tech === '热转印'">
                        <Col span="8">
                            <FormItem label="刺绣厂">
                                <Select v-model="addOrderForm.printshop_2" placeholder="请选择热印厂">
                                    <Option v-for="printshop in printShops" v-if="printshop.type === 5" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                                <FormItem  label="印刷费" prop="date">
                                <Input v-model.number="addOrderForm.printshop_2_cost" placeholder="印刷费"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4" offset='4'>
                            <Upload action="//jsonplaceholder.typicode.com/posts/">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传效果图</Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row v-if="tech === '刺绣'">
                        <Col span="8">
                            <FormItem label="刺绣厂">
                                <Select v-model="addOrderForm.printshop_3" placeholder="请选择刺绣厂">
                                    <Option v-for="printshop in printShops" v-if="printshop.type === 6" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                                <FormItem  label="印刷费" prop="date">
                                <Input v-model.number="addOrderForm.printshop_3_cost" placeholder="印刷费"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4" offset='4'>
                            <Upload action="//jsonplaceholder.typicode.com/posts/">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传效果图</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    </Col>
</template>
