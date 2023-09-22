import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Divider, Form, Input, List, Modal} from 'antd';
import {TableDescription} from "@aws-sdk/client-dynamodb/dist-types/models";
import { useRouter } from 'next/router'

const {Meta} = Card;
const DynamoDBTables: React.FC = () => {
    const [tables, setTables] = useState<TableDescription[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        // form.resetFields();
    };
    const router = useRouter();
    const handleCancel = () => {
        setIsModalOpen(false);
        // form.resetFields();
    };
    useEffect(() => {
        fetch('api/dynamodb/all_tables', {method: "GET"})
            .then(res => {
                res.json().then(
                    (json => {
                        setTables(json)
                    })
                )
            })
    }, [])

    return (
<>
    <Button type="primary" onClick={showModal}>
        Add New DynamoDB Table
    </Button>
    <Divider />
    <Modal title="Basic Modal" onCancel={handleCancel}
           open={isModalOpen} footer={null}  width={800}>
        {/*<Form*/}
        {/*    {...layout}*/}
        {/*    form={form}*/}
        {/*    name="control-hooks"*/}
        {/*    onFinish={onFinish}*/}
        {/*    style={{ maxWidth: 600 }}*/}
        {/*>*/}
        {/*    <Form.Item name="name" label="Name" rules={[{ required: true }]}>*/}
        {/*        <Input />*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item name="email" label="email" rules={[{ required: true }]}>*/}
        {/*        <Input />*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item name="address" label="address" rules={[{ required: true }]}>*/}
        {/*        <Input />*/}
        {/*    </Form.Item>*/}

        {/*    <Form.Item {...tailLayout} >*/}
        {/*        <Button type="primary" htmlType="submit">*/}
        {/*            Submit*/}
        {/*        </Button>*/}
        {/*        <Button htmlType="button" onClick={onReset}>*/}
        {/*            Reset*/}
        {/*        </Button>*/}
        {/*        <Button  htmlType="button" onClick={onFill}>*/}
        {/*            Fill form*/}
        {/*        </Button>*/}
        {/*        <Button  htmlType="button" onClick={handleCancel}>*/}
        {/*            Cancel*/}
        {/*        </Button>*/}
        {/*    </Form.Item>*/}
        {/*</Form>*/}
    </Modal>

    <List
        // itemLayout="horizontal"
        grid={{gutter: 16, column: 3}}
        dataSource={tables}
        renderItem={({TableName, AttributeDefinitions, CreationDateTime}, index) => (
            <List.Item>
                <Card
                    hoverable
                    onClick={()=>{router.push(`/dynamodb/${TableName}`)}}
                    title={TableName}>
                    <Meta
                        avatar={<Avatar
                            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}
                        // title="Card title"
                        description={JSON.stringify(
                                AttributeDefinitions?.map(a => a.AttributeName))
                            +
                            JSON.stringify(CreationDateTime)
                        }
                    />
                </Card>
            </List.Item>
        )}
    />
</>
    )
};

export default DynamoDBTables;
