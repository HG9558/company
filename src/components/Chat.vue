<template>
   <div data-ng-app="custom-service" id="custom-service">
      <div data-ng-controller="MainCtrl">
        <!-- <link rel="stylesheet" data-ng-href="{{ css }}"> -->
        <div class="dialog-container heart animation opacity-0"  data-ng-class="{'opacity-0': !open}">

            <!-- 侧栏 -->
            <div class="toolbar vertical">
                <div class="left">
                    <span class="icon-box" data-ng-click="isChat = 0" data-ng-class="{on: isChat == 0}"  title="对话列表"><label class="icon chat-list" data-ng-class="{on: isChat == 0}"></label></span>
                    <span class="icon-box" data-ng-click="isChat = 1" data-ng-class="{on: isChat == 1}" title="联系人列表"><label class="icon contact-list" data-ng-class="{on: isChat == 1}" ></label></span>
                    
                    <span class="icon-box" data-ng-click="isChat =2" data-ng-class="{on: isChat == 2}" title="我的个人信息"><label class="icon myInformation" data-ng-class="{on: isChat == 2}" ></label></span>

                </div>



            </div>

            <!-- 中心区 -->
            <div class="center">


                <!-- 左侧列表页 -->
                <div class="left">
                    <!-- 对话列表页 -->
                    <div class="first-page page on">

                        <ul class="chat-list" >
                            <li class="item"  data-ng-repeat="contact in contacts | filter:hasLengthOrExist | orderBy: '-activeLevel' | orderBy: 'staticLevel' " data-ng-class="{selected: contact.selected}" data-ng-click="$parent.newAction = ''; $parent.openChat( contact.id, contact)">
                                    <label for="" class="icon avatar" data-ng-class="[contact.img, contact.stat == 1 ? 'online': 'offline' ]"></label>
                                    <i class="icon"  data-ng-show="contact.state.indexOf('og') != -1 " data-ng-class="{online: contact.state == 'online', leave: contact.state != 'offline' }"></i>
                                    <label for="" class="ellipsis text-with-icon">{{contact.nickname || contact.text || '陌生人'}}</label>
                                    <label for="" class="ellipsis last-message" data-ng-if="  contact.messages[0] &&  contact.messages[ contact.messages.length - 1 ].type == 'text' "  ng-bind-html="parseEmoticon(contact.messages[ contact.messages.length - 1 ].content) | stopwords | trust"
                                    >  </label>

                                     <label for="" class="ellipsis last-message" data-ng-if="  contact.messages[0] &&  contact.messages[ contact.messages.length - 1 ].type == 'image' " > 图片：{{ contact.messages[ contact.messages.length - 1 ].content[0].name }} </label>


                                      <label for="" class="ellipsis last-message" data-ng-if="  contact.messages[0] &&  contact.messages[ contact.messages.length - 1 ].type == 'file' " > 文件：{{ contact.messages[ contact.messages.length - 1 ].content[0].name }} </label>



                                    <label for="" class="badge" data-ng-if="!contact.noDelete" >
                                      <span data-ng-show="contact.length && contact.length > 0 " data-ng-class=" { wide: contact.length > 9 } " >{{contact.length}}</span>
                                      <b class="icon delete effect-red" data-ng-click="deleteContact(contact)"></b>
                                    </label>     
                            </li>
                        </ul>
                    </div>
                    
                    <!-- 联系人列表页 -->
                    <div class="second-page page" data-ng-class="{on: isChat ==  1 || isChat == 2}">

                        <div class="input-box">
                            <lable><input type="text" placeholder="输入姓名" data-ng-model="filter" ><i class="icon search"></i>
                            </lable>
                            <i class="add-group-box" title=" 新建分组与群聊 "><span class="icon add-group"></span></i>
                            <div class="more-actions-detail">
                              <div class="change-name" data-ng-click=" newAction = 'new-group-now'  ">新建分组</div>
                              <div class="group-manage" data-ng-click=" newAction = 'new-group-chat-now' ">新建群聊</div>
                           </div>
                        </div>
                    
                        <div class="group-toggle" data-ng-class="{all: all, online: !all}">
                            <div class="all" data-ng-click="all = true; state = '' ">全部</div>
                            <div class="online" data-ng-click="all = false; state = 1 ">在线</div>
                            <label for="" class="open"></label>
                        </div>

                        <!-- 去掉下拉刷新功能<div class="contact-list-box" data-pull-fresh="down" data-trigger="getContactList" data-progress="contactListProgress" data-client-height="0" > -->

                        <div class="contact-list-box">

                            
                            <dl  class="contact-list" >
                                
                                <dd class="item" data-ng-repeat="contact in contacts | filter: {gid: 'def_top_group'} " data-ng-class="{selected: contact.selected, 'special-contact': true}" data-ng-show="contact.text" title=" {{contact.disabled?'您无权使用客服功能': ''}} " data-ng-dblclick="$parent.newAction = ''; $parent.openChat( contact.id, contact)" >
                                    <label for="" class="icon chat-small" data-ng-class="[contact.img, contact.stat == 1 ? 'online': 'offline' ]"></label>
                                    <lable class="ellipsis text-with-icon">{{ contact.nickName || contact.text }}</lable>
                                    <label for="" class="badge" data-ng-show="contact.length && contact.length > 0 ">
                                      <span>
                                        {{contact.length}}
                                      </span>
                                    </label>
                                </dd>

                            </dl>    
                            

                            <dl  class="contact-list" data-ng-repeat="group in mySelf.myGroups" data-ng-class="{collapse: group.collapse, hasCollapse: true, showMoreAction: group.showMoreAction }" data-ng-show="  !filter || (filter &&( (contacts | filter: { gid: group.id, text: filter }).length > 0 || ( (contacts | filter: { gid: group.id, nickname: filter }).length > 0  ) )&& ( (group.collapse = false) || true) )  " >
                                <dt class="item" data-ng-click="group.collapse = !group.collapse" data-ng-class="{ showMoreAction: group.showMoreAction}">
                                    <i class="back-button" data-ng-class="{'rotate-after': !group.collapse}"></i>
                                    <label for="" class="">{{ group.nickname || group.text}}</label>
                                    <label class="contact-count">{{ (contacts | filter: { gid: group.id, stat: 1 }).length }}/{{ (contacts | filter: {gid: group.id}).length }}</label>
                                    
                                    <div class="icon more-actions" data-ng-show="group.id != 'def_str_group' " data-ng-click=" !group.showMoreAction && $parent.closeAllActions();group.showMoreAction = !group.showMoreAction; $event.stopPropagation(); ">
                                      <div class="more-actions-buttons">
                                        <span class="ds-button red just" data-ng-show="!group.readOnly"  data-ng-click="$parent.deleteGroup = true; $parent.currentManageContact = group; $event.stopPropagation(); ">删除</span>
                                        <span class="ds-button blue just" data-ng-show="!group.readOnly" data-ng-click="$parent.newAction = 'edit-name-now'; $parent.currentManageContact = group; $event.stopPropagation(); ">改名</span>

                                        <span class="ds-button just refresh"  data-ng-click="$parent.newAction = ''; $parent.openGroup(group) ;$event.stopPropagation(); ">群发</span>
                                      </div>
                                    </div>

                                </dt>
                                <dd class="item" data-ng-repeat="contact in contacts | filter: { gid: group.id } | filter: {stat: state} | orderBy: '-stat' " data-ng-class="{selected: contact.selected, 'special-contact': contact.class, showMoreAction: contact.showMoreAction &&  contact.actionCount == actionCount }"  data-ng-dblclick=" $parent.$parent.newAction = '';  $parent.$parent.openChat('', contact)" 

                                data-ng-show=" ( ( [contact] | filter: { text: filter }).length > 0 || ( ( [contact] | filter: { nickname: filter }).length > 0  ) )  "
                                >
                                    <label for="" class="icon chat-small " data-ng-class="[contact.img, contact.stat == 1 ? 'online': 'offline' ]"></label>
                                    <lable class="ellipsis text-with-icon">{{ contact.nickname || contact.text }}</lable>
                                    <label for="" class="badge" data-ng-show="contact.length && contact.length > 0 ">
                                      <span>
                                        {{contact.length}}
                                      </span>
                                    </label>

                                     <div class="icon more-actions" data-ng-show="contact.gid != 'def_str_group' " data-ng-click=" !contact.showMoreAction && $parent.$parent.closeAllActions(); contact.showMoreAction = !contact.showMoreAction;  $event.stopPropagation();  ">
                                      <div class="more-actions-buttons">
                                        <span class="ds-button blue just" data-ng-show="!contact.readOnly" data-ng-click="$parent.$parent.currentManageContact = contact; $parent.$parent.newAction = 'edit-name-now'; $event.stopPropagation(); " >改名{{ actionCount }}</span>
                                        <span class="ds-button just group-manage" data-ng-show="!contact.readOnly"  data-ng-click="$parent.$parent.currentManageContact = contact; $parent.$parent.newAction = 'group-manage-now'; $event.stopPropagation(); ">分组</span>
                                      </div>
                                    </div>
                                </dd>

                            </dl>    

                           
                            
                        </div>

                        <p class="loading-box" data-ng-class="{show: contactListProgress.type != 0, gray: contactListProgress.type == 1}">
                          <b class="icon loading" data-ng-show="contactListProgress.type == 2 "></b>
                          <lable class="ellipsis">{{ contactListProgress.text }}</lable>
                        </p>
                    </div> 
                    <!-- 人个信息页 -->
                    <div class="third-page page" data-ng-class="{on: isChat == 2 }">
                      <ul class="my-info">
                        <li class="main">
                          <i class="icon avatar" data-ng-class="[ mySelf.img ]" ></i>
                          <span class="ellipsis my-name"> {{ mySelf.nickname || mySelf.name }} </span>
                          <span class="ellipsis my-account">帐号：<span> {{ mySelf.text }} </span></span>

                        </li>
                        <li data-ng-click=" currentManageContact = mySelf; newAction = 'edit-name-now'">
                          <i class="icon edit-name"></i>
                          <span class="ellipsis">更改昵称</span>
                          <div class="line"></div>
                        </li>
                        <li data-ng-click="newAction = 'edit-head-pic-now'">
                          <i class="icon edit-head-pic"></i>
                          <span class="ellipsis">更改头像</span>
                        </li>
                        <li class="get-spread-url" clip-copy="mySelf.spreadURL" clip-click="copyEventHandler()" data-ng-show="mySelf.spreadURL">
                          <i class="icon copy-url"></i>
                          复制推广码
                          <span data-ng-show="copyRight" class="copy-right">复制成功</span>
                          <span data-ng-bind="copy" class="copy-text" data-ng-show="false"></span>
                        </li>
                      </ul>
                    </div>    
                </div>


                <!-- 右侧聊天页、操作页 -->
                <div class="right">
                    
                    <!-- 右侧按钮区 -->
                    <div class="newtools">
                      <span class="icon minisize" data-ng-click=" open = false "></span>
                      <span class="icon more-actions" data-ng-show=" currentContact.gid && !newAction && currentContact.existChat && currentContact.gid != 'ICHAT_SYS_MSG_ID' && currentContact.gid != 'def_top_group' && currentContact.gid != 'def_str_group' "></span>

                      <div class="more-actions-detail">
                        <div class="change-name" data-ng-click="currentManageContact = currentContact; newAction = 'edit-name-now' ">改名</div>
                        <div class="group-manage" data-ng-click="currentManageContact = currentContact; newAction = 'group-manage-now' ">分组</div>
                      </div>

                      <span class="back-step" data-ng-show=" newAction " data-ng-click=" newAction == 'new-group-chat-now' && cancelNewGroupChat();  newAction = '';  ">
                        返回
                        <span class="icon back"></span>
                      </span>
                    </div>
                    
                    <!-- 当前聊天人信息区 -->
                    <div class="item chat-person">
                        <i class="icon avatar" data-ng-class="[currentContact.img, currentContact.stat == 1 ? 'online': 'offline' ]" ></i>
                        <div>
                            <p class="ellipsis">{{ currentContact.nickname || currentContact.text || '陌生人' }}</p>
                            <span class="status-describe" data-ng-show="currentContact.id != 'def_top_group' " >{{ currentContact.stat== 1  ? '在线': '离线' }} </span>
                            <i class="icon" data-ng-show=" currentContact.id != 'def_top_group' && currentContact.id != 'def_str_group'  && currentContact.stat == 1 " data-ng-class="[ currentContact.stat == 1 ? 'online': 'offline' ]"></i>
                        </div>
                    </div>
                    
                    <!-- 聊天内容展示区 -->
                    <div class="message-box">

                        <p class="loading-box" data-ng-class="{show: chatListProgress.type > 0, gray: chatListProgress.type == 1}">
                          <b class="icon loading" data-ng-show="chatListProgress.type == 2"></b>
                          <lable class="ellipsis">{{ chatListProgress.text }}</lable>
                        </p>

                        <ul id="message-box"  data-pull-fresh="up" data-client-Height="msgClientHeight" data-trigger = "getChatMessageList" data-progress="chatListProgress" data-in-progress=" requestSend " data-is-disabled = " !currentContact.gid " >
                            <li class="item message" data-ng-repeat="message in (currentContact.messages|| []) track by $index" data-ng-class="{self: (message.receiverId &&  message.receiverId != $parent.id) || (!message.receiverId && message.isAdminSend == '0')  }" data-ng-switch="message.type">
                                <i class="icon chat" data-ng-class="[message.senderId != $parent.id && currentContact.state, message.senderId != $parent.id && currentContact.img, ( (message.receiverId &&  message.receiverId != $parent.id) || (!message.receiverId && message.isAdminSend == '0') )&& $parent.mySelf.img ]" ></i>
                                
                                <div class="message-content" data-ng-class="[message.styleClass]" data-ng-switch-when="text">

                                    <pre style="text-align: left" ng-bind-html="parseEmoticon(message.content) | stopwords | trust | addSpace:10 " data-ng-if="message.receiverId != $parent.id"></pre>
                                    <pre style="text-align: left" ng-bind-html="parseEmoticon(message.content) | trust | addSpace:4 " data-ng-if="message.receiverId == $parent.id"></pre>

                                    <label for="" class="message-time">  {{ message.sendTime | getDateByString | date:'HH:mm'}}
                                        
                                    </label>

                                    <span class="icon send-state" data-ng-class="[ message.stat == -2 && 'sending',(message.stat == 0 || message.stat == 1) && 'sended', message.stat == 2 && 'readed'  ]" ></span>

                                </div>


                                 <div class="message-content" data-ng-switch-when="image">
                                  <div class="file-container" data-ng-repeat="img in message.content">
                                    <a data-ng-click="$parent.previewImg.src = img.originUrl; $parent.previewImg.title = img.name"><img data-ng-src="{{ img.url }}" alt="{{ img.name }}" data-ng-if="img.url"></a>
                                    <div>
                                      <span class="file-name ellipsis">{{ img.name }}</span>
                                      <span class="file-size ellipsis">

                                       {{ img.size/1024 | number: 2  }}KB 
                                       {{ img.progress=='发送失败'?img.progress:(img.progress + '% ') }}



                                       
                                      </span>


                                    </div>
                                  </div>

                                  <label for="" class="message-time">{{message.sendTime | getDateByString  | date:'HH:mm'}}</label>

                                  <span class="icon send-state" data-ng-class="[ message.stat == -2 && 'sending', (message.stat == 0 || message.stat == 1) && 'sended', message.stat == 2 && 'readed'  ]" ></span>


                                </div>


                                <div class="message-content" data-ng-switch-when="file">
                                  <div class="file-container" data-ng-repeat="file in message.content">
                                    <a class="icon file"></a>
                                    <div>
                                      <span class="file-name ellipsis">{{ file.name }}</span>
                                      <span class="file-size ellipsis">

                                       {{ file.size/1024 | number: 2  }}KB 

                                       <span class="toggleDownload whenSelf">{{ file.progress=='发送失败'?file.progress:(file.progress + '% ') }}</span>

                                       <a class="toggleDownload"  data-ng-click="downloadnow(file.downloadurl)"> 下载 </a>




                                       
                                      </span>


                                    </div>
                                  </div>

                                  <label for="" class="message-time">{{message.sendTime | getDateByString  | date:'HH:mm'}}</label>

                                  <span class="icon send-state" data-ng-class="[ message.stat == -2 && 'sending', (message.stat == 0 || message.stat == 1) && 'sended', message.stat == 2 && 'readed'  ]" ></span>


                                </div>

                                
                                <div  class="time-division-line " data-ng-show=" currentContact.messages[$index + 1] && ( ( currentContact.messages[$index + 1].sendTime | getDateByString).getFullYear() != (message.sendTime | getDateByString ).getFullYear() ||( currentContact.messages[$index + 1].sendTime | getDateByString).getMonth() != (message.sendTime | getDateByString ).getMonth() ||( currentContact.messages[$index + 1].sendTime | getDateByString).getDate() != (message.sendTime | getDateByString ).getDate() ) " > {{ currentContact.messages[$index + 1].sendTime| getDateByString | date: 'yyyy-MM-dd' }} </div>

                            </li>
                        </ul>
                    </div>

                    <!-- 输入区 -->
                    <div class=" input-area">


                        <span class="add-appendix-box" data-ng-mouseenter=" showUploadOptions = true " data-ng-mouseleave = " delayHideUploadOptions() " >
                          <span class="icon add-appendix"></span>
                        </span>

                        <div class="upload-options" data-ng-show = "showUploadOptions" >
                          <div  class="upload-image"
                                class="upload-file"
                                ngf-select ng-model="files" 
                                ngf-multiple="true"
                                accept="image/*"
                                ngf-validate-fn="validate($file)" 
                                title="发送图片"
                          >
                            图片
                            <span class="icon upload-image"></span>
                          </div>
                           <div class="upload-file"
                              ngf-select ng-model="files" 
                              accept=""
                              ngf-multiple="true"
                              ngf-validate-fn="validate($file)" 
                              title="发送文件"
                           >
                            文件
                            <span class="icon upload-file"></span>
                          </div>
                        </div>

                        <div class="files-container">
                          <div class="file-container" data-ng-repeat="file in files">
                            <img  data-name="{{file.name}}" data-size="{{ file.size }}" data-progress="{{ file.progress }}" data-ng  ngf-src="file"  class="upload-img-temp" >
                          </div>
                        </div>

                        <div class="message-textarea-box">
                          <textarea  elastic name="sent" type="text" id="sent" class="message-textarea"  placeholder="在此输入消息"  style="height: 44px;">
                          </textarea>
                        </div>

                            
                        <span class="emotion-box" id="emoticon"><i class="icon emoticon" ></i></span>
                        <button class="send effect-blue" data-ng-click="beforeSend('text', msg)">发送</button>
                    </div>
                    
                    <!-- 当前没有聊天人 -->
                    <div class="cover no-chat" data-ng-hide="currentContact.existChat">
                      <div>
                        <img data-ng-src=" {{ noChat }} ">
                        <span style="color: #b8d8eb">当前无聊天，单击可以进行聊天</span>
                      </div>
                    </div>

                    <!-- 操作页 -->
                    <div class="new-action-page" data-ng-show="newAction">

                      <div class="edit-name-now" data-ng-show=" newAction == 'edit-name-now' ">
                        <label for="">
                          <span>备注名：</span>
                          <input type="text" placeholder="请输入昵称" data-ng-model="NICKNAME"  class="ds-input wider higher" id="editNameNow"  />

                        </label>
                        <div class="buttons">
                          <span class="ds-button blue wide high" data-ng-click= " editNickName(); newAction = '' " >提交</span>
                        </div>
                      </div>

                      <div class="new-group-now" data-ng-show=" newAction == 'new-group-now' ">
                        <label for="newGroupName">
                          <span>新建组名：</span>
                          <input type="text" placeholder="请输入组名" data-ng-model="GROUPNAME"  class="ds-input wider higher" id="newGroupName" />

                        </label>
                        <div class="buttons">
                          <span class="ds-button blue wide high" data-ng-click=" newAction = ''; newGroupNow() " >提交</span>
                        </div>
                      </div>
                      
                      <div class="edit-head-pic-now" data-ng-show=" newAction == 'edit-head-pic-now' ">
                        
                        <label for="">可选头像</label>
                        <div>


                            <span class="icon head-pic-choice A-01" data-ng-repeat = " imgClass in imgClasses" data-ng-class="[ imgClass, (mySelf.img == imgClass  )&& 'checked' ]" data-ng-click="changeImgClass(imgClass)"></span>


                        </div>

                      </div>


                      <div class="group-manage-now" data-ng-show=" newAction == 'group-manage-now' ">
                        
                        <label for="">移动到</label>
                        <ul class="group-list">
                          <li class="the-group" data-ng-repeat=" myGroup in mySelf.myGroups | filter: {id: '!def_str_group'} " 

                          data-ng-click = " changeGroup(myGroup) "

                          data-ng-class="{ checked: (currentManageContact.gid === myGroup.id) }" 
                          
                          >
                            {{ myGroup.text }}  
                            <span class="icon checked"></span>

                          </li>
                        
                        </ul>

                      </div>


                       <div class="group-manage-now new-group-chat-now" data-ng-show=" newAction == 'new-group-chat-now' ">
                        
                        <label for="">选择联系人  <span data-ng-show="  (contacts | filter: {marked: true})[0] ">( {{  (contacts | filter: {marked: true}).length }} )</span> </label>
                        <ul class="group-list" >
                          <li class="the-group" data-ng-repeat-start=" group in mySelf.myGroups" data-ng-click=" group.collapseSelect = !group.collapseSelect ">

                              <i class="back-button" data-ng-class="{'rotate-after': !group.collapseSelect}"></i>

                             {{ group.text }}  
  
                           
                         

                          </li>

                           <li  data-ng-repeat=" contact in contacts | filter: {gid: group.id} " 

                            data-ng-show=" !group.collapseSelect "

                            data-ng-click = " contact.marked = !contact.marked "

                            data-ng-class="{ checked: contact.marked  }" 
                            
                            >
                              <span class="icon chat-small" data-ng-class="[ contact.img || 'A-01' ]" ></span>
                              {{ contact.nickname || contact.text || contact.id }}  
                              <span class="icon checked"></span>

                          </li>
                          <li data-ng-repeat-end style="display: none"></li>
                        
                        </ul>

                        <div class="buttons">
                          <span class="ds-button blue " data-ng-click= " newGroupChatNow(); newAction = '' " >确定</span>
                        </div>

                      </div>

                    </div>
                </div>

                <!-- 删除分组弹出框 -->
                <div class="delete-group" data-ng-show="deleteGroup">
                      <div>
                        <span class="icon warn-action"></span>
                        确定要删除 “<span>{{ currentManageContact.groupNm || currentManageContact.text }}</span>” 这个分组吗？
                        <div class="buttons">
                          <span class="yes" data-ng-click="deleteGroup = false; deleteGroupNow(); ">确定</span>
                          <span class="no"  data-ng-click="deleteGroup = false; ">取消</span>
                        </div>
                       
                      </div>
                </div>


                  <!-- 切换客服弹出框 -->
                <div class="delete-group" data-ng-show="showSwitch">
                      <div>
                        <span class="icon warn-action"></span>
                        确定要切换到 “<span>{{ switchContact.text || switchContact.nickNm }}</span>” 吗？
                        <div class="buttons">
                          <span class="yes" data-ng-click="switchToAnotherSever(); showSwitch = false;">确定</span>
                          <span class="no"  data-ng-click="showSwitch = false; ">取消</span>
                        </div>
                       
                      </div>
                </div>

                <!-- 操作提示 -->
                <div class="action-note" data-ng-show="showActionNote.flag" >
                      <span class="icon success-action"></span>
                      <span>已移动至 “<span>{{  showActionNote.groupName }}</span>” </span>
                </div>


            </div>

            <!-- 弹出框 推广码 -->
            <div class="promp" data-ng-show="showPromp && copy">
                <div class="toolbar">
                    <span class="title">推广码</span>
                    <span class="icon-box" data-ng-click="showPromp = false"><label class="icon close"></label></span>
                </div>
                <div class="content">
                  <span data-ng-bind="copy" class="copy-text">
                  </span>
                  <span data-ng-show="copyRight" class="copy-right">复制成功</span>
                  <button clip-copy="copy" clip-click="copyEventHandler()">复制</button>
                </div>
            </div>
            
            <!-- 弹出框 对客服的评价 -->
            <div class="promp" data-ng-init="starCount = 4;describeWorld = '';evaluted = 4;" data-ng-show="evaluate">

                <div class="toolbar">
                    <span class="title">评价</span>
                    <span class="icon-box" data-ng-click="setEvaluate(evaluted, 'forceClose'); evaluted = -1;"><label class="icon close"></label></span>
                </div>

                <div class="content" >
                  <div class="ll j a_stars" style="position: relative; top: 15px;">
                    <label for="">
                        请评价客服的工作： 
                    </label>
                    <span id="rating" style="position: relative; top: 3px; left: 3px;">
                      
                      <span id="stars" data-ng-mouseleave = "(starCount = evaluted)">
                        <a >
                          <img data-ng-src=" {{ starCount>0?colorStarUrl:emptyStarUrl }} " data-ng-mouseover="starCount = 1" data-ng-click="evaluted = 1; starCount = 1">
                        </a>
                        <a >
                          <img data-ng-src=" {{ starCount>1?colorStarUrl:emptyStarUrl }} " data-ng-mouseover="starCount = 2" data-ng-click="evaluted = 2; starCount = 2">
                        </a>
                        <a >
                          <img data-ng-src=" {{ starCount>2?colorStarUrl:emptyStarUrl }} " data-ng-mouseover="starCount = 3" data-ng-click="evaluted = 3; starCount = 3">
                        </a>
                        <a >
                          <img data-ng-src=" {{ starCount>3?colorStarUrl:emptyStarUrl }} " data-ng-mouseover="starCount = 4" data-ng-click="evaluted = 4; starCount = 4">
                        </a>
                        <a >
                          <img data-ng-src=" {{ starCount>4?colorStarUrl:emptyStarUrl }} " data-ng-mouseover="starCount = 5" data-ng-click="evaluted = 5; starCount = 5">
                        </a>
                      </span>
                      <span style="position: relative; left: 7px; top: -3px; color: #f1aa00;">{{ starCount==1?'很差':starCount==2?'较差':starCount==3?'一般':starCount==4?'满意':starCount==5?'完美':'' }}</span>
                    </span>
                  </div>
                  <button class="effect-blue" data-ng-click="setEvaluate(evaluted); evaluted = 4;">提交</button>
                </div>

            </div>
            
            <!-- 覆盖层 -->
            <div class="over-view" data-ng-show="showPromp || evaluate"></div>
        </div>
        
        <!-- 启动按钮 -->
        <div class="custom-service-box"  data-ng-class="{showSlideBox: newMessages.length > 0 && newMessages.length != (newMessages|filter:{dontShowNew: true}).length}">
            <b class="icon loading" data-ng-show="close == true" title="加载中..." style="position: absolute; top: 17px; left: 17px;"></b>
            <div class="icon custom-service load" data-ng-class="{load: close, disabled: close == 'close' }" data-ng-click="( (close == 'close') && (manualReconnect() || true ) ) || ((open = !open) && openChat())"></div>
            <label for="" class="badge fall-up" data-ng-class="{'fall-up': close }" data-ng-show="newMessages.length > 0" data-ng-bind="newMessages.length"></label>
            <div class="message-cut fall-up" data-ng-class="{'fall-up': close }" data-ng-show="newMessages.length > 0 && newMessages.length != (newMessages|filter:{dontShowNew: true}).length">
              <ul>
                <li class="item ellipsis ng-hide-animate move-in" data-ng-repeat="newMessage in newMessages" data-ng-class="{'move-in': newMessage.moveIn, 'ng-hide-animate': !newMessage.dontShowNew}" data-ng-click="openChat(newMessage.senderId)"  data-ng-switch="newMessage.type" data-ng-show="!newMessage.dontShowNew">
                  <span  ng-switch-when="text"  ng-bind-html=" parseEmoticon(newMessage.content) | trust"></span>
                  <span  ng-switch-when="image">收到一张图片...</span>
                  <span  ng-switch-when="file">收到一个文件...</span>
                </li>
              </ul>
            </div>
        </div>
        
        <!-- 图片预览 -->
        <div class="img-preview opacity-0" data-ng-hide="!previewImg.src" data-ng-class="{'opacity-0': !previewImg.src}">
          <span class="icon-box" data-ng-click="previewImg.src = ''"><label class="icon close"></label></span>
          <img  data-ng-src="{{ previewImg.src || '' }}" title="{{ previewImg.title }}" alt="{{ previewImg.title }}"  class="heart" />
        </div>

        <!-- 提示音 -->
        <audio preload="auto" id="newMessageAlert" >
          <source  data-ng-src="{{sounds()}}" type="audio/mpeg">
        </audio>
      </div>
    </div>
</template>

<script>
import '../chat/lib'
import '../chat/main'
export default {
  data () {
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style lang="stylus">

</style>
