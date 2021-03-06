import { App } from 'vue'
import {
  Button,
	Tab,
	Tabs,
	Uploader,
	Field,
	Picker,
	Popup,
	DatetimePicker,
	Form,
	Overlay,
	ActionSheet,
	PullRefresh,
	Loading,
	Search,
	List,
	Cell,
	NavBar,
  Toast,
  Image,
  Col, Row,
  Icon,
  Tabbar, TabbarItem,
  Tag,
	CellGroup,
  Badge,
	SwipeCell,
	Dialog,
	Circle
} from 'vant'

// https://vant-contrib.gitee.io/vant/v3/#/zh-CN
const plugins = [
  Button,
	Tab,
	Tabs,
	Uploader,
	Field,
	Picker,
	Popup,
	DatetimePicker,
	Form,
	Overlay,
	ActionSheet,
	PullRefresh,
	Loading,
	Search,
	List,
	Cell,
	NavBar,
  Toast,
  Image,
  Col, Row,
  Icon,
  Tabbar, TabbarItem,
  Tag,
	CellGroup,
  Badge,
	SwipeCell,
	Dialog,
	Circle
]
export default{
  install: function(vm: App):void {
    plugins.forEach(item => {
      vm.component(item.name, item)
    })
  }
}
