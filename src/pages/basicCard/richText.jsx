import React from 'react'
import {Card, Button, Modal} from 'antd'
import {Editor} from 'react-draft-wysiwyg'
import {ContentState, EditorState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft  from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { BackgroundColor } from 'chalk'

export default class RichText extends React.Component{
  constructor(props) {
    super(props)
  }
  state = {
    showRichText: false,
    editorContent: '',
    editorState: '',
    disabled:false
  }
  componentDidMount() {
    this.onConversion(this.props.couponUsageExplain)
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.couponUsageExplain && this.props.couponUsageExplain !== nextProps.couponUsageExplain){
      this.onConversion(nextProps.couponUsageExplain)
    }
    if(nextProps.disabled && this.disabled !== nextProps.disabled){
      this.setState({
        disabled:nextProps.disabled
      })
    }
  }
  /*html 转换 js*/
  onConversion = (text) =>{
    let contentBlock = htmlToDraft(text)
    if (contentBlock) {
      let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      let editorState = EditorState.createWithContent(contentState)
      this.setState({ editorState })
    }
  }
  handleClearContent = () => {  //清空文本
    this.setState({
      editorState: ''
    })
  }
  handleGetText = () => {    //获取文本内容
    this.setState({
      showRichText: true
    })
  }
  onEditorStateChange = (editorState) => {   //编辑器的状态
    this.setState({
      editorState
    })
  }
  onEditorChange = (editorContent) => {   //编辑器内容的状态
    this.setState({
      editorContent
    })
    this.props.onTextChange(draftToHtml(editorContent))
  }
  render(){
    const { editorState, editorContent, disabled } = this.state;
    return (
        <div>
          {/*<Card>*/}
          {/*  <Button type="primary" onClick={this.handleClearContent}>清空内容</Button>*/}
          {/*  <Button type="primary" onClick={this.handleGetText} style={{marginLeft: 10}}>获取html文本</Button>*/}
          {/*</Card>*/}
          <Card>
            <Editor 
                toolbarHidden
                localization={{ locale: 'zh' }}
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                onContentStateChange={this.onEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
            />
          </Card>
          <Modal
              title="富文本"
              visible={this.state.showRichText}
              onCancel={() =>{
                this.setState({
                  showRichText: false
                })
              }}
              footer={null}>
            {draftToHtml(this.state.editorContent)}
          </Modal>
        </div>
    )
  }
}　　　
