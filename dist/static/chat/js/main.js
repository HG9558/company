(function() {
  var customService;

  customService = angular.module("custom-service", ['ngFileUpload', 'ngSanitize', 'ngClipboard']);

  customService.service('user', [
    '$location', function($location) {
      var ref, ref1, ref2, ref3;
      return {
        id: ((ref = window.chatConfig) != null ? ref.id : void 0) || ((ref1 = $location.search()) != null ? ref1.id : void 0) || '',
        key: ((ref2 = window.chatConfig) != null ? ref2.key : void 0) || ((ref3 = $location.search()) != null ? ref3.key : void 0) || ''
      };
    }
  ]).value('rootPath', chatConfig.rootPath || window.location.host).value('path', chatConfig.path || 'ichatClient').value('assetPath', 'http://' + window.chatConfig.rootPath + '/' + window.chatConfig.path + '/client/').config([
    'ngClipProvider', function(ngClipProvider) {
      return ngClipProvider.setPath('http://' + window.chatConfig.rootPath + '/' + window.chatConfig.path + '/client/' + 'media/ZeroClipboard.swf');
    }
  ]).config([
    '$compileProvider', function($compileProvider) {
      return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
    }
  ]).factory('Socket', [
    'rootPath', 'path', '$timeout', 'getDateNow', 'Buffer', function(rootPath, path, $timeout, getDateNow, Buffer) {
      var Socket, afterSocketGet, beforeSocketSend, proceedBinaryData;
      beforeSocketSend = function(msg) {
        return msg;
      };
      afterSocketGet = function(msg) {
        return msg;
      };
      proceedBinaryData = function(data) {
        var MyBlob, a, fileContent, fileId, fileTypeName, url;
        fileTypeName = Buffer.buf2text(data.slice(9, 14));
        fileId = Buffer.buf2text(data.slice(14, 25));
        fileContent = Buffer.buf2text(data.slice(25));
        console.log(MyMimeType.lookup('xxx.' + Buffer.deleteSpan(fileTypeName)));
        MyBlob = new Blob([data.slice(25)], {
          type: MyMimeType.lookup('xxx.' + Buffer.deleteSpan(fileTypeName))
        });
        url = URL.createObjectURL(MyBlob);
        a = document.createElement("a");
        document.body.appendChild(a);
        a.innerHTML = '下载';
        a.onclick = function() {
          return saveAs(MyBlob, (Buffer.deleteSpan(fileId)) + '.' + (Buffer.deleteSpan(fileTypeName)));
        };
        return console.log(url);
      };
      Socket = {
        data: {},
        notify: {},
        connectTimes: 3,
        socket: null,
        get: function(msg) {
          msg = beforeSocketSend(msg);
          this.socket.send(JSON.stringify(msg));
          return console.log('send', msg);
        },
        sendFile: function(file) {
          this.socket.send(file);
          return console.log('send', file);
        },
        close: function(code, reason) {
          return this.socket.close(code, reason);
        },
        connect: function(auto) {
          var text, type;
          type = '';
          text = '客服系统连接中....';
          if (auto && this.connectTimes < 1) {
            text = '重连次数过多， 连接已经断开';
            type = 'error';
          }
          Messager.message({
            text: text,
            type: type,
            position: 'bottom'
          });
          if (this.connectTimes < 1 && auto) {
            return;
          }
          this.connectTimes--;
          this.socket = new WebSocket('ws://' + rootPath + '/' + path + '/websocket/client');
          if (this.socket) {
            this.socket.binaryType = 'arraybuffer';
            this.socket.onopen = function(evt) {
              var base;
              return typeof (base = Socket.notify).open === "function" ? base.open() : void 0;
            };
            this.socket.onmessage = function(evt) {
              var base, base1, base10, base11, base12, base2, base3, base4, base5, base6, base7, base8, base9, msg;
              if (evt.data.byteLength !== 'undefind' && evt.data.byteLength > 0) {
                proceedBinaryData(evt.data);
                return true;
              }
              msg = JSON.parse(evt.data);
              console.log('get', msg);
              msg = afterSocketGet(msg);
              switch (msg.commandType) {
                case 1002:
                  return typeof (base = Socket.notify).register === "function" ? base.register(msg.resultCode) : void 0;
                case 1006:
                  return typeof (base1 = Socket.notify).close === "function" ? base1.close('self', '你已在别处登陆， 即将退出') : void 0;
                case 2002:
                  return typeof (base2 = Socket.notify).contactLists === "function" ? base2.contactLists(msg) : void 0;
                case 2004:
                  return typeof (base3 = Socket.notify).contact === "function" ? base3.contact(msg) : void 0;
                case 2022:
                  return typeof (base4 = Socket.notify).messageList === "function" ? base4.messageList(msg) : void 0;
                case 2011:
                  return typeof (base5 = Socket.notify).status === "function" ? base5.status(msg) : void 0;
                case 3001:
                  return typeof (base6 = Socket.notify).message === "function" ? base6.message(msg) : void 0;
                case 3002:
                  return typeof (base7 = Socket.notify).messageFeedback === "function" ? base7.messageFeedback(msg) : void 0;
                case 3006:
                  return typeof (base8 = Socket.notify).messageReaded === "function" ? base8.messageReaded(msg) : void 0;
                case 3008:
                  return typeof (base9 = Socket.notify).groupFeedback === "function" ? base9.groupFeedback(msg) : void 0;
                case 5002:
                  return typeof (base10 = Socket.notify).addNewGroup === "function" ? base10.addNewGroup(msg) : void 0;
                case 4002:
                  return typeof (base11 = Socket.notify).contactReady === "function" ? base11.contactReady(msg) : void 0;
                case 4004:
                  return typeof (base12 = Socket.notify).serviceBreak === "function" ? base12.serviceBreak(msg) : void 0;
                case 1234:
                  return $timeout(function() {
                    var base13;
                    return typeof (base13 = Socket.notify).fileMessage === "function" ? base13.fileMessage(msg) : void 0;
                  }, 500);
              }
            };
            this.socket.onerror = function(evt) {
              var base;
              return typeof (base = Socket.notify).error === "function" ? base.error(evt.target.readyState) : void 0;
            };
            return this.socket.onclose = function(evt) {
              var base;
              console.log(evt);
              return typeof (base = Socket.notify).close === "function" ? base.close(evt.code, evt.reason) : void 0;
            };
          }
        }
      };
      Socket.connect();
      return Socket;
    }
  ]).factory('Buffer', [
    function() {
      var Buffer;
      return Buffer = {
        text2ua: function(s, length) {
          var i, j, len, ua, w;
          ua = new Uint8Array(length || s.length);
          for (i = j = 0, len = s.length; j < len; i = ++j) {
            w = s[i];
            ua[i] = s.charCodeAt(i);
          }
          return ua;
        },
        buf2text: function(buf) {
          return String.fromCharCode.apply(null, new Uint8Array(buf));
        },
        concat: function(buf, buff) {
          var result;
          result = new Uint8Array(buf.byteLength + buff.byteLength);
          result.set(new Uint8Array(buf), 0);
          result.set(new Uint8Array(buff), buf.byteLength);
          return result;
        },
        deleteSpan: function(s) {
          var i, j, len, ss, w;
          ss = '';
          for (i = j = 0, len = s.length; j < len; i = ++j) {
            w = s[i];
            w.charCodeAt(0) !== 0 && (ss += w);
          }
          return ss;
        }
      };
    }
  ]).directive('pullFresh', [
    '$timeout', '$interval', function($timeout, $interval) {
      return {
        restrict: 'A',
        scope: {
          trigger: '=',
          progress: '=',
          clientHeight: '=',
          inProgress: '=',
          isDisabled: '='
        },
        link: function(scope, element, attrs) {
          var preScollTop, time;
          preScollTop = 0;
          time = 500;
          return angular.element(element).on('scroll', function() {
            if (scope.inProgress && scope.inProgress.progress || scope.isDisabled) {
              return false;
            }
            if (scope.clientHeight !== "undefind") {
              scope.clientHeight = this.scrollHeight;
            }
            if (attrs.pullFresh === 'down') {
              if (this.scrollTop > preScollTop) {
                if ((this.clientHeight + this.scrollTop) >= this.scrollHeight - 50 && scope.progress.type === 0) {
                  scope.$parent.$apply(function() {
                    return scope.progress.type = 1;
                  });
                }
                if ((this.clientHeight + this.scrollTop) >= this.scrollHeight && scope.progress.type === 1) {
                  $timeout(function() {
                    scope.progress.type = 2;
                    return scope.trigger('');
                  }, time);
                }
              } else {
                scope.$parent.$apply(function() {
                  return scope.progress.type = 0;
                });
              }
            } else if (attrs.pullFresh === 'up') {
              if (this.scrollTop < preScollTop) {
                if (this.scrollTop <= 50) {
                  scope.$parent.$apply(function() {
                    return scope.progress.type = 1;
                  });
                }
                if (this.scrollTop === 0) {
                  $timeout(function() {
                    scope.progress.type = 2;
                    return scope.trigger('');
                  }, time);
                }
              } else {
                scope.$parent.$apply(function() {
                  return scope.progress.type = 0;
                });
              }
            }
            return preScollTop = this.scrollTop || 0;
          });
        }
      };
    }
  ]).directive('elastic', [
    '$timeout', function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          var resize;
          $scope.initialHeight = $scope.initialHeight || element[0].style.height;
          resize = function(e) {
            if (e && (e.keyCode === 13 && e.ctrlKey)) {
              console.log('preventDefault');
              e.preventDefault();
            }
            element[0].style.height = $scope.initialHeight;
            element[0].style.height = "" + element[0].scrollHeight + "px";
            if (element[0].style.height && parseInt(element[0].style.height) >= parseInt($scope.initialHeight)) {
              element.parent().parent()[0].style.height = parseInt(element[0].style.height) + 1 + 'px';
            }
            return console.log(element[0].style.height);
          };
          element.on("input change keypress", resize);
          return $timeout(resize, 0);
        }
      };
    }
  ]).factory('autoProgress', [
    '$timeout', function($timeout) {
      var autoProgress;
      autoProgress = function() {
        var increase, increaseProgress, selfs, time;
        selfs = this;
        if (selfs.size < 1024) {
          time = 4;
          increase = 90;
        } else if (selfs.size < 20 * 1024) {
          time = 20;
          increase = 30;
        } else {
          time = 50;
          increase = 10;
        }
        increaseProgress = function() {
          if (selfs.resolved) {
            time = time / 2;
            increase = increase * 2;
          } else {
            time = time * 2;
            increase = increase / 2;
          }
          return $timeout(function() {
            var preProgress;
            if (selfs.progress === '发送失败') {
              return false;
            }
            preProgress = selfs.progress;
            selfs.progress += Math.ceil(Math.random() * increase);
            if (selfs.progress === 100) {
              selfs.progress = preProgress + Math.ceil(Math.random() * (99 - preProgress));
            }
            if (selfs.progress > 100) {
              if (selfs.resolved) {
                selfs.progress = 100;
              } else {
                selfs.progress = preProgress + Math.ceil(Math.random() * (99 - preProgress));
              }
            }
            if (selfs.progress < 100 && selfs.progress > 0) {
              return increaseProgress(time);
            }
          }, time);
        };
        increaseProgress(time);
        return $timeout(function() {
          if (selfs.progress !== 100) {
            return selfs.progress = '发送失败';
          }
        }, 20000);
      };
      return autoProgress;
    }
  ]).filter('trust', [
    '$sce', function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }
  ]).filter('addSpace', [
    function() {
      return function(text, number) {
        var result, space;
        space = '&nbsp;';
        number = number || 6;
        result = text;
        while (number > 0) {
          number -= 1;
          result += space;
        }
        return result;
      };
    }
  ]).filter('stopwords', [
    function() {
      var replaceWords, stopwords;
      stopwords = [/[\d]{6,}/g];
      replaceWords = '***';
      return function(text) {
        var j, len, word;
        for (j = 0, len = stopwords.length; j < len; j++) {
          word = stopwords[j];
          if (word) {
            text = text.replace(word, function(catchText) {
              if (parseInt(catchText)) {
                return replaceWords;
              } else {
                return replaceWords;
              }
            });
          }
        }
        return text;
      };
    }
  ]).filter('getDateByString', [
    function() {
      return function(dateString) {
        var ref;
        if (dateString) {
          dateString = (ref = dateString.split('.')[0]) != null ? ref.replace(/-/g, '/') : void 0;
        }
        return new Date(dateString);
      };
    }
  ]).factory('Storage', [
    '$filter', function($filter) {
      var maxAccountLength, maxContactsLenghth;
      maxAccountLength = 5;
      maxContactsLenghth = 10;
      return {
        maxAccountLength: maxAccountLength,
        maxContactsLenght: maxContactsLenghth,
        get: function(id) {
          var account, recentContacts;
          if (!localStorage || !localStorage.recentContacts) {
            return [];
          }
          recentContacts = JSON.parse(localStorage.recentContacts);
          account = $filter('filter')(recentContacts, {
            id: id
          }, true)[0];
          if (!account) {
            return [];
          }
          return account.contacts;
        },
        setRecentContactsForAccount: function(id, contacts) {
          var account, recentContacts;
          if (!localStorage) {
            return;
          }
          recentContacts = localStorage.recentContacts ? JSON.parse(localStorage.recentContacts) : [];
          account = $filter('filter')(recentContacts, {
            id: id
          }, true)[0];
          if (!account) {
            account = {
              id: id,
              contacts: []
            };
            recentContacts.unshift(account);
            if (recentContacts.length > maxAccountLength) {
              recentContacts.pop();
            }
          }
          account.contacts = contacts;
          return localStorage.setItem('recentContacts', JSON.stringify(recentContacts));
        }
      };
    }
  ]).service('getDateNow', [
    '$filter', function($filter) {
      return function() {
        return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
      };
    }
  ]).controller('MainCtrl', [
    '$sce', '$scope', '$http', '$timeout', '$interval', '$filter', 'Upload', 'Socket', 'user', '$location', 'Buffer', 'rootPath', 'path', 'autoProgress', 'getDateNow', 'Storage', '$window', '$rootScope', 'assetPath', function($sce, $scope, $http, $timeout, $interval, $filter, Upload, Socket, user, $location, Buffer, rootPath, path, autoProgress, getDateNow, Storage, $window, $rootScope, assetPath) {
      var ErrorFileExtName, closeBySelf, default_gid, deleteNewMessages, errorTimes, evaluateServer, findContact, getAnotherServer, getNexPage, ifMatch, inintContactReady, initSelectedContact, isAnotherSeverConnected, isServer, messageId, newFile, newStranger, numberPerPage, reconnect, registerFailTimes, replaySounds, scrollToBottom, sendFile, setAllMessageReaded, setFocus, sounds, storeRecentContactsNow, stranger_gid, stystem, tempFiles, temp_gid;
      $scope.assetPath = assetPath;
      $scope.emptyStarUrl = assetPath + 'img/star.png';
      $scope.colorStarUrl = assetPath + 'img/star-gold.png';
      $scope.noChat = assetPath + 'img/no-chat.png';
      $scope.sounds = function() {
        return $sce.trustAsResourceUrl(assetPath + 'media/sounds.mp3');
      };
      $scope.css = assetPath + 'css/index.css';
      default_gid = 'def_sub_group';
      stranger_gid = 'def_str_group';
      $scope.imgClasses = ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06', 'B-07', 'C-01', 'C-02', 'C-03', 'C-04', 'C-05', 'C-06', 'C-07', 'D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06', 'D-07'];
      ErrorFileExtName = ['exe'];
      $scope.newAction = '';
      stystem = {
        id: 'ICHAT_SYS_MSG_ID',
        gid: 'ICHAT_SYS_MSG_ID',
        text: '系统消息',
        img: 'system',
        messages: [],
        readOnly: true,
        existChat: true,
        ready: '-1',
        activeLevel: 0,
        staticLevel: 100,
        noDelete: true,
        stat: 1
      };
      $scope.mySelf = {
        id: '24749',
        account: 'liliang1147',
        name: '小周',
        img: 'A-01',
        myGroups: [
          {
            id: '0',
            name: '下级',
            describe: 'default'
          }, {
            id: 'A',
            name: '三人组',
            describe: 'edit'
          }, {
            id: 'B',
            name: '四人组',
            describe: 'edit'
          }, {
            id: 'C',
            name: '五人组',
            describe: 'edit'
          }, {
            id: 'D',
            name: '六人组',
            describe: 'edit'
          }, {
            id: 'E',
            name: '七人组',
            describe: 'edit'
          }
        ]
      };
      $scope.contacts = [];
      $scope.currentManageContact = {
        id: '24749',
        name: '小明',
        nickName: '大狗',
        imgClass: 'A-01',
        groupId: '0'
      };
      $scope.NICKNAME = '';
      $scope.editNickName = function() {
        if ($scope.NICKNAME.length > 10) {
          Messager.alert('备注不能超过10个字符');
          return;
        }
        $scope.currentManageContact.nickname = $scope.NICKNAME;
        if ($scope.currentManageContact.id === $scope.mySelf.id) {
          return Socket.get({
            commandType: 6001,
            nickNm: $scope.NICKNAME
          });
        } else if ($scope.currentManageContact.gid) {
          return Socket.get({
            commandType: 5007,
            subId: $scope.currentManageContact.id,
            groupId: $scope.currentManageContact.gid,
            nickNm: $scope.NICKNAME
          });
        } else {
          $scope.currentManageContact.groupNm = $scope.NICKNAME;
          return Socket.get({
            commandType: 5003,
            groupId: $scope.currentManageContact.id,
            groupNm: $scope.NICKNAME
          });
        }
      };
      $scope.showActionNote = {};
      $scope.changeGroup = function(group) {
        var ref;
        if ($scope.currentManageContact.gid && $scope.currentManageContact.gid === group.id) {
          return;
        }
        $scope.currentManageContact.gid = group.id;
        $scope.showActionNote.flag = true;
        $scope.showActionNote.groupName = (ref = $filter('filter')($scope.mySelf.myGroups, {
          id: group.id
        }, true)[0]) != null ? ref.text : void 0;
        $timeout(function() {
          return $scope.showActionNote.flag = false;
        }, 1000);
        Socket.get({
          commandType: 5007,
          subId: $scope.currentManageContact.id,
          groupId: group.id,
          nickNm: $scope.currentManageContact.nickname
        });
        return $scope.newAction = '';
      };
      $scope.closeAllActions = function() {
        angular.forEach($filter('filter')($scope.contacts, {
          showMoreAction: true
        }, true), function(e, i) {
          return e.showMoreAction = false;
        });
        return angular.forEach($filter('filter')($scope.mySelf.myGroups, {
          showMoreAction: true
        }, true), function(e, i) {
          return e.showMoreAction = false;
        });
      };
      temp_gid = 1000;
      $scope.newGroupChatNow = function() {
        var contact, oldGroupChats, receiverId, text;
        receiverId = '';
        text = '';
        angular.forEach($filter('orderBy')($filter('filter')($scope.contacts, {
          marked: true
        }, true), 'id'), function(e, i) {
          if (i === 0) {
            receiverId += e.id;
            return text += e.nickname || e.text || e.id;
          } else {
            receiverId += ',' + e.id;
            if (i < 3) {
              text += ',' + (e.nickname || e.text || e.id);
            }
            if (i === 3) {
              return text += ' ...(' + $filter('filter')($scope.contacts, {
                marked: true
              }, true).length + ')';
            }
          }
        });
        if (!receiverId) {
          return;
        }
        contact = $filter('filter')($scope.contacts, {
          receiverId: receiverId
        }, true)[0];
        if (contact) {
          $scope.setSelected(contact);
          return;
        }
        oldGroupChats = $filter('filter')($scope.contacts, {
          receiverId: ''
        }, true);
        if (oldGroupChats[0]) {
          temp_gid = parseInt($filter('orderBy')(oldGroupChats, '-id')[0].id);
          temp_gid++;
        }
        contact = {
          id: 'GROUP-' + temp_gid++,
          receiverId: receiverId,
          text: text,
          existChat: true,
          img: 'group',
          stat: 1
        };
        $scope.contacts.push(contact);
        $scope.setSelected(contact);
        return $scope.cancelNewGroupChat();
      };
      $scope.cancelNewGroupChat = function() {
        return angular.forEach($filter('filter')($scope.contacts, {
          marked: true
        }, true), function(e, i) {
          return e.marked = false;
        });
      };
      $scope.deleteGroupNow = function() {
        angular.forEach($filter('filter')($scope.contacts, {
          gid: $scope.currentManageContact.id
        }, true), function(e, i) {
          return e.gid = default_gid;
        });
        $scope.mySelf.myGroups = $filter('filter')($scope.mySelf.myGroups, {
          id: '!' + $scope.currentManageContact.id
        }, true);
        Socket.get({
          commandType: 5005,
          groupId: $scope.currentManageContact.id
        });
        if ($scope.currentManageContact && $scope.currentManageContact.id === $scope.currentManageContact.id) {
          $scope.currentManageContact = null;
          return $scope.newAction = '';
        }
      };
      $scope.newGroupNow = function() {
        if ($scope.GROUPNAME.length > 10) {
          Messager.alert('组名不能超过10个字符');
          return;
        }
        if ($scope.GROUPNAME) {
          $scope.mySelf.myGroups.push({
            id: temp_gid++,
            text: $scope.GROUPNAME,
            userAdd: true
          });
          return Socket.get({
            commandType: 5001,
            groupNm: $scope.GROUPNAME
          });
        }
      };
      Socket.notify.addNewGroup = function(msg) {
        var ref, ref1, useAddGroups;
        useAddGroups = $filter('filter')($scope.mySelf.myGroups, {
          userAdd: true
        }, true);
        if (msg.resultCode === 0 && useAddGroups[0]) {
          useAddGroups = $filter('orderBy')(useAddGroups, 'id');
          if ((ref = useAddGroups[0]) != null) {
            ref.id = msg.groupId;
          }
          if ((ref1 = useAddGroups[0]) != null) {
            ref1.userAdd = null;
          }
          return console.log(useAddGroups);
        }
      };
      $scope.changeImgClass = function(imgClass) {
        $scope.mySelf.img = imgClass;
        return Socket.get({
          commandType: 6003,
          imgId: imgClass
        });
      };
      $scope.downloadFileNow = function(file) {};
      $scope.manualReconnect = function() {
        var reconnect;
        Socket.connect();
        reconnect = true;
        return $scope.close = true;
      };
      reconnect = false;
      closeBySelf = false;
      Socket.notify.open = function() {
        var userAgent;
        closeBySelf = false;
        userAgent = '';
        if (navigator && navigator.userAgent) {
          userAgent = navigator.userAgent;
        }
        if (!userAgent && window.navigator && window.navigator.userAgent) {
          userAgent = window.navigator.userAgent;
        }
        console.log('socket connected, userAgent: ', userAgent);
        return Socket.get({
          commandType: 1001,
          userId: user.id,
          token: user.key,
          userAgent: userAgent,
          loginType: 'web',
          validateType: 'pwd',
          pltCd: window.chatConfig.pltCd
        });
      };
      errorTimes = 1;
      Socket.notify.error = function(status) {
        var notice;
        switch (status) {
          case 0:
            notice = '连接还没开启';
            break;
          case 1:
            notice = '连接已开启并准备好进行通信';
            break;
          case 2:
            notice = '连接正在关闭的过程中';
            break;
          case 3:
            notice = '连接已经关闭，或者连接无法建立';
        }
        $scope.close = 'close';
        if (Socket.connectTimes < 0 && errorTimes > 0) {
          errorTimes--;
          Messager.message({
            text: notice,
            type: 'error',
            position: 'bottom'
          });
        }
        return $scope.$apply();
      };
      Socket.notify.close = function(code, reason) {
        console.log('socket closed, cause: ' + code + ', ' + (reason || '网络错误'));
        if (code === 'self') {
          closeBySelf = true;
          Messager.message({
            text: reason
          });
          $timeout(function() {
            return Socket.close();
          }, 1000);
        }
        $scope.close = 'close';
        $scope.open = false;
        $scope.$apply();
        if (Socket.connectTimes < 0 || closeBySelf) {
          return;
        }
        Socket.connect(true);
        if (Socket.connectTimes < 1) {
          return null;
        }
        reconnect = true;
        $scope.close = true;
        return $scope.$apply();
      };
      registerFailTimes = 1;
      Socket.notify.register = function(status) {
        if (status >= 0) {
          if (status === 2) {
            $scope.serveDisabled = true;
          }
          Socket.get({
            commandType: 2001,
            pageNum: $scope.contactListPage
          });
          $scope.close = false;
        } else if (registerFailTimes) {
          Messager.alert({
            text: '用户注册聊天功能失败',
            type: 'alert-error',
            ok: '确定'
          });
          $scope.close = false;
        }
        return $scope.$apply();
      };
      Socket.notify.contactLists = function(cls) {
        stystem && cls.contact.push(stystem);
        $timeout(function() {
          $scope.contactListProgress.type = 0;
          return $scope.contactListProgress.text = '加载更多联系人';
        }, 0);
        $scope.mySelf = cls.self;
        $scope.id = $scope.userId = user.id = cls.self.id;
        angular.forEach(cls.group, function(e, i) {
          e.stat = 1;
          return e.img = 'group';
        });
        $scope.mySelf.myGroups = cls.group;
        angular.forEach(cls.contact, function(e, i) {
          e.activeLevel = 0;
          return e.ogid = e.gid;
        });
        angular.forEach(Storage.get($scope.id), function(e, i) {
          var contact;
          contact = $filter('filter')(cls.contact, {
            id: e.id
          }, true)[0];
          if (!contact) {
            contact = $filter('filter')($scope.mySelf.myGroups, {
              id: e.id
            }, true)[0];
            if (!contact && e.senderId) {
              contact = e;
            }
            if (!contact) {
              return;
            }
            contact.img = 'group';
            contact.stat = 1;
            cls.contact.push(contact);
          }
          if (contact) {
            contact.existChat = true;
            contact.messages = e.messages;
            contact.activeLevel = e.activeLevel || 0;
            delete contact.ready;
            if ((isServer(contact.id)) || contact.id === stystem.id) {
              contact.ready = '-1';
            }
            contact.fakerMsgLength = $filter('filter')(contact.messages, {
              id: '!'
            }, false).length;
            return console.log(contact.nickname || contact.text, '虚假消息数', contact.fakerMsgLength, contact.messages);
          }
        });
        $scope.contacts = cls.contact;
        return reconnect = false;
      };
      Socket.notify.contact = function(msg) {
        if (msg.resultCode !== 0) {
          return false;
        }
        if ($scope.contacts) {
          if (!(findContact('id', msg.id))) {
            delete msg.resultCode;
            delete msg.commandType;
            if (msg.gid === 'def_sub_group') {
              msg.ogid = 'def_sub_group';
            }
            $scope.contacts.push(msg);
            return $scope.$apply();
          }
        } else {
          return $timeout(function() {
            return Socket.notify.contact(msg);
          }, 1000);
        }
      };
      messageId = 0;
      Socket.notify.message = function(msg, contact) {
        var ref, self;
        if (!msg) {
          return null;
        }
        if (typeof msg === 'text') {
          msg = JSON.parse(msg);
        }
        self = false;
        if (contact || msg.senderId === user.id) {
          self = true;
          if (contact && !contact.fakerMsgLength) {
            contact.fakerMsgLength = 1;
          } else {
            contact && contact.fakerMsgLength++;
          }
          contact && (msg.messageId = String(messageId++));
          contact = findContact('id', msg.receiverId);
        } else {
          if (isServer(msg.senderId)) {
            contact = findContact('id', msg.senderId);
            if (contact.ready !== '2') {
              contact = getAnotherServer(msg.senderId);
              if (contact && contact.ready !== '2') {
                contact = null;
              }
            }
          }
        }
        contact = contact || (findContact('id', msg.senderId));
        if ($scope.contacts && !contact) {
          contact = newStranger(msg);
        }
        if (contact) {
          contact.activeLevel = ++messageId;
          !contact.messages && (contact.messages = []);
          !msg.receiverId && (msg.receiverId = $scope.id);
          contact.messages.push(msg);
          if (!$scope.currentContact) {
            $scope.setSelected(contact);
          }
          if (msg.type === 'image') {
            angular.forEach(msg.content, function(file, i) {
              file.progress = 1;
              return autoProgress.call(file);
            });
          }
          if (msg.type === 'file') {
            angular.forEach(msg.content, function(file, i) {
              if (self) {
                file.progress = 1;
                return autoProgress.call(file);
              } else {
                return file.progress = '下载';
              }
            });
          }
          if (((ref = $scope.currentContact) != null ? ref.id : void 0) === contact.id) {
            $timeout(scrollToBottom, 0);
            if (!$scope.open) {
              $scope.addNewMessage(msg);
              contact.length = (contact.length || 0) + 1;
            } else {
              setAllMessageReaded(contact);
            }
          } else {
            contact.length = (contact.length || 0) + 1;
            $scope.addNewMessage(msg);
          }
          return $timeout(scrollToBottom, 0);
        } else {
          return $timeout(function() {
            return Socket.notify.message(msg);
          }, 1000);
        }
      };
      Socket.notify.messageFeedback = function(msg) {
        var contact, contactId, message;
        if (!$scope.contacts[0]) {
          return;
        }
        message = null;
        contactId = msg.receiverId;
        contact = $filter('filter')($scope.contacts, {
          id: contactId
        }, true)[0];
        console.log('contact: ', contact);
        if (contact && contact.messages) {
          message = $filter('filter')(contact.messages, {
            messageId: msg.messageId
          }, true)[0];
          if (msg.resultCode === -1 || !message) {
            return;
          }
          message.id = msg.id;
          delete message.messageId;
          if (!contact.fakerMsgLength) {
            contact.fakerMsgLength = 0;
          } else {
            contact.fakerMsgLength--;
          }
          message.stat = 0;
          return console.log('已发送', message);
        }
      };
      Socket.notify.messageReaded = function(msg) {
        var contact, contactId, message;
        if (!$scope.contacts[0]) {
          return;
        }
        message = null;
        contactId = msg.receiverId;
        contact = $filter('filter')($scope.contacts, {
          id: contactId
        }, true)[0];
        if (contact && contact.messages) {
          message = $filter('filter')(contact.messages, {
            id: msg.id
          }, true)[0];
          if (!message) {
            return;
          }
          message.stat = 2;
          $scope.$apply();
          return console.log('已阅读', message);
        }
      };
      Socket.notify.groupFeedback = function(msg) {
        var group, groupChildren, sendmsg;
        if (msg.resultCode === 0 && msg.groupId) {
          group = findContact('id', msg.groupId);
          if (!group || !group.messages) {
            return;
          }
          sendmsg = $filter('filter')(group.messages, {
            messageId: msg.messageId
          }, true)[0];
          if (!sendmsg) {
            return;
          }
          sendmsg.commandType = 3001;
          delete sendmsg.messageId;
          sendmsg.receiverId = '';
          sendmsg.senderId = $scope.userId;
          sendmsg.stat = 1;
          groupChildren = [];
          if (msg.groupId === 'def_sub_group') {
            groupChildren = $filter('filter')($scope.contacts, {
              gid: '!def_str_group',
              existChat: true
            }, true);
            groupChildren = $filter('filter')(groupChildren, {
              gid: '!def_top_group',
              existChat: true
            }, true);
          } else {
            groupChildren = $filter('filter')($scope.contacts, {
              gid: msg.groupId,
              existChat: true
            }, true);
          }
          return angular.forEach(groupChildren, function(e, i) {
            var thismsg;
            if (e.messages && e.messages[0]) {
              thismsg = angular.copy(sendmsg);
              thismsg.receiverId = e.id;
              return e.messages.push(thismsg);
            }
          });
        }
      };
      newStranger = function(msg) {
        var stranger;
        stranger = {
          id: msg.senderId,
          text: '陌生人' || msg.senderId,
          stat: '1',
          gid: stranger_gid,
          img: 'A-01',
          readOnly: true
        };
        $scope.contacts.push(stranger);
        return stranger;
      };
      Socket.notify.messageList = function(msg) {
        var contact, contactId, openNewChat;
        if (!msg.content[0]) {
          $scope.chatListProgress.type = 0;
          $scope.chatListProgress.text = '向上加载更多';
          return false;
        }
        contactId = msg.contactId;
        contact = findContact('id', contactId);
        console.log('........', contactId);
        if (!contact) {
          console.log('联系人不存在');
          return false;
        }
        openNewChat = !contact.messages || !contact.messages[10];
        $timeout(function() {
          $scope.chatListProgress.type = 0;
          $scope.chatListProgress.text = '向上加载更多';
          if (openNewChat) {
            return scrollToBottom();
          } else {
            console.log('get msg to scroll: ', $scope.msgClientHeight);
            return scrollToBottom($scope.msgClientHeight);
          }
        }, 0);
        !contact.messages && (contact.messages = []);
        getNexPage(contact);
        angular.forEach(msg.content, function(e, i) {
          if ((e.type === 'file' || e.type === 'image') && typeof e.content !== 'object') {
            e.content = JSON.parse(e.content);
          }
          if (e.userId && e.adminId) {
            if (e.isAdminSend === '1') {
              e.senderId = msg.contactId;
              e.receiverId = $scope.id;
            } else {
              e.senderId = $scope.id;
              e.receiverId = msg.contactId;
            }
            delete e.adminId;
            delete e.userId;
            delete e.isAdminSend;
            delete e.isMeanu;
            delete e.page;
            delete e.rows;
            delete e.text;
            return delete e.code;
          }
        });
        console.log(contact.index);
        return contact.messages = msg.content.reverse().slice(0, msg.content.length - contact.index).concat(contact.messages);
      };
      $scope.refreshContactList = function() {
        return Socket.get({
          commandType: 2001,
          pageNum: $scope.contactListPage
        });
      };
      Socket.notify.status = function(contact) {
        var ref;
        if ((ref = findContact('id', String(contact.userId))) != null) {
          ref.stat = contact.userStat;
        }
        return $scope.$apply();
      };
      Socket.notify.serviceBreak = function(msg) {
        var kf, kf2;
        kf = findContact('id', 'ICHAT_STAFF_747');
        kf2 = findContact('id', 'ICHAT_STAFF_380');
        if (kf) {
          Socket.notify.contactReady(msg, kf);
        }
        if (kf2) {
          return Socket.notify.contactReady(msg, kf2);
        }
      };
      Socket.notify.contactReady = function(msg, kf) {
        var styleClass, text;
        if (!msg.stat) {
          return;
        }
        kf = kf || (findContact('id', msg.id));
        if (!kf) {
          return false;
        }
        if (kf.ready === '2' && (msg.stat === '2' || msg.stat === '1')) {
          return false;
        }
        text = '';
        styleClass = '';
        switch (msg.stat) {
          case '1':
            text = '[系统消息]请您稍候，客服连接中...';
            break;
          case '2':
            text = '[系统消息]客服连接成功，开始咨询';
            styleClass = 'green';
            break;
          case '3':
            text = '[系统消息]会话已经结束，即将关闭';
            styleClass = 'red';
            break;
          case '-1':
            text = msg.msg || '[系统消息]很抱歉，当前没有可用客服   ( 注：客服工作时间为早09:00至晚02:00 ), 请您在该段时间内再次双击客服进行联系。';
            styleClass = 'red';
        }
        if (text) {
          console.log('插入一条虚假消息');
          Socket.notify.message({
            senderId: msg.id || kf.id,
            receiverId: $scope.id,
            type: 'text',
            sendTime: getDateNow(),
            content: text,
            styleClass: styleClass
          });
          if (!kf.fakerMsgLength) {
            kf.fakerMsgLength = 1;
          } else {
            kf.fakerMsgLength++;
          }
        }
        if (msg.stat === '2') {
          $scope.contactReady.reset();
          if (!kf.messages || !kf.messages[10]) {
            $scope.getChatMessageList();
          }
        }
        kf.ready = msg.stat;
        if (kf.ready === '3') {
          kf.ready = '-1';
          setTimeout(function() {
            var initSelectedContact;
            kf.existChat = false;
            deleteNewMessages(kf.id);
            delete kf.messages;
            kf.length = 0;
            kf.fakerMsgLength = 0;
            if (kf.selected) {
              $scope.currentContact = null;
              kf.selected = false;
              return initSelectedContact = true;
            }
          }, 500);
          return $scope.$apply();
        }
      };
      Socket.notify.contactReReady = function() {
        var kf;
        kf = findContact('isServer', true);
        if (kf) {
          return $scope.$apply(function() {
            var text;
            kf.id = 'kf';
            $scope.setSelected(kf);
            text = '[系统消息]由于目前您的网络与我们对接不稳，目前正在重试中，请您稍候...';
            console.log('插入一条虚假消息');
            Socket.notify.message({
              senderId: 'kf',
              receiverId: $scope.id,
              type: 'string',
              time: getDateNow(),
              content: text
            });
            if (!kf.fakerMsgLength) {
              kf.fakerMsgLength = 1;
            } else {
              kf.fakerMsgLength++;
            }
            return Socket.get({
              commandType: 4001
            });
          });
        }
      };
      $scope.close = true;
      $scope.contactListPage = 0;
      $scope.id = user.id;
      $scope.key = user.key;
      $scope.isChat = 0;
      $scope.showPromp = false;
      $scope.open = false;
      $scope.all = true;
      $scope.newMessages = [];
      $scope.msg = '';
      $scope.copy = '';
      $scope.serveDisabled = false;
      $scope.previewImg = {
        src: '',
        title: ''
      };
      $scope.copyEventHandler = function() {
        $scope.copyRight = true;
        $timeout(function() {
          $scope.showPromp = false;
          return $scope.copyRight = false;
        }, 1500);
        return true;
      };
      $scope.contactListProgress = {
        type: 0,
        text: '向下加载更多'
      };
      $scope.chatListProgress = {
        type: 0,
        text: '向上加载更多'
      };
      $scope.getContactList = function() {
        $scope.contactListProgress.text = "加载中...";
        return Socket.get({
          commandType: 2001,
          pageNum: ++$scope.contactListPage
        });
      };
      $scope.requestSend = {
        progress: false
      };
      $scope.getChatMessageList = function() {
        var nextPage;
        if (!$scope.currentContact) {
          return;
        }
        if (!$scope.currentContact.gid) {
          return;
        }
        if ($scope.requestSend.progress) {
          return false;
        }
        $scope.requestSend.progress = true;
        $timeout(function() {
          return $scope.requestSend.progress = false;
        }, 100);
        $scope.chatListProgress.text = "加载中...";
        nextPage = getNexPage();
        Socket.get({
          commandType: 2021,
          contactId: $scope.currentContact.id,
          pageNum: $scope.currentContact.page,
          pageSize: numberPerPage
        });
        return $timeout(function() {
          $scope.chatListProgress.type = 0;
          return $scope.chatListProgress.text = '向上加载更多';
        }, 5000);
      };
      numberPerPage = 15;
      getNexPage = function(contact) {
        var currentPage, msgLength, ref, remainder;
        contact = contact || $scope.currentContact;
        msgLength = ((ref = contact.messages) != null ? ref.length : void 0) || 0;
        msgLength = msgLength - (contact.fakerMsgLength || 0);
        currentPage = (Math.ceil(msgLength / numberPerPage)) + 1;
        remainder = msgLength % numberPerPage;
        if (remainder === 0) {
          currentPage++;
        }
        currentPage--;
        if (currentPage < 0) {
          currentPage = 0;
        }
        contact.page = currentPage;
        return contact.index = remainder;
      };
      $scope.msgClientHeight = 0;

      /*过滤 */
      $scope.filter = '';
      $scope.state = '';
      $scope.myFilter = function(item) {
        var ref, status;
        if ($scope.filter === '' && $scope.state === '') {
          true;
        }
        status = false;
        if ((ref = item.contacts) != null ? ref[0] : void 0) {
          angular.forEach(item.contacts, function(item) {
            if (ifMatch(item)) {
              return status = true;
            }
          });
        } else {
          status = ifMatch(item);
        }
        return status;
      };
      ifMatch = function(item) {
        if (item.text !== 'undefind') {
          return ((item.text.toLowerCase().indexOf($scope.filter.toLowerCase())) !== -1 || $scope.filter === '') && (item.state === $scope.state || $scope.state === '' || item.state.indexOf('og') !== -1);
        } else {
          return false;
        }
      };
      initSelectedContact = true;
      $scope.hasLengthOrExist = function(item) {
        if (item.id === 'kf') {
          return false;
        }
        return (item.length && (parseInt(item.length)) > 0 && (item.existChat = true) || item.existChat) && ((initSelectedContact && (item.selected = true) && ($scope.currentContact = item) && ($scope.getChatMessageList() || true) && (initSelectedContact = false)) || true);
      };
      $scope.setSelected = function(item) {
        var ref;
        if ((ref = $filter('filter')($scope.contacts, {
          selected: true
        }, true)[0]) != null) {
          ref.selected = false;
        }
        item.selected = true;
        item.existChat = true;
        item.length = 0;
        $scope.currentContact = item;
        return setAllMessageReaded($scope.currentContact);
      };
      $scope.evaluate = false;
      evaluateServer = null;
      $scope.setEvaluate = function(score, forceCLose) {
        if (score > 0) {
          $scope.evaluate = false;
        }
        if (forceCLose) {
          $scope.evaluate = false;
        }
        if (!$scope.evaluate) {
          if (score > 0) {
            Socket.get({
              commandType: 7001,
              grade: score
            });
            Messager.message({
              text: '感谢您的评分，让我们能更好的为您服务',
              position: 'heart'
            });
          }
          $timeout(function() {
            return Socket.get({
              commandType: 4003
            });
          }, 1000);
        } else {
          Messager.message({
            type: 'alert',
            text: '你还没有选择评分哦',
            ok: '确定'
          });
        }
        return null;
      };
      $scope.deleteContact = function(item, dontEvaluate) {
        if (!(isServer(item.id))) {
          item.existChat = false;
          deleteNewMessages(item.id);
          if (item.selected) {
            $scope.currentContact = null;
            item.selected = false;
            initSelectedContact = true;
          }
        }
        if (isServer(item.id)) {
          if (item.ready === '2' && !dontEvaluate) {
            evaluateServer = item;
            return $scope.evaluate = true;
          } else {
            item.existChat = false;
            deleteNewMessages(item.id);
            if (item.selected) {
              $scope.currentContact = null;
              item.selected = false;
              return initSelectedContact = true;
            }
          }
        }
      };
      Socket.notify.delContact = function(msg) {
        var server;
        if (msg.reconnectFlag) {
          return Socket.notify.contactReReady();
        } else {
          Socket.notify.message({
            senderId: msg.svrId,
            receiverId: $scope.id,
            type: 'string',
            time: getDateNow(),
            content: '[系统消息]客服已经断开了与您的连接， 感谢您的咨询'
          });
          server = findContact('id', msg.svrId);
          if (!server.fakerMsgLength) {
            server.fakerMsgLength = 1;
          } else {
            server.fakerMsgLength++;
          }
          $scope.setSelected(server);
          return $timeout(function() {
            if ((findContact('isServer', true)).id !== 'kf') {
              return $scope.deleteContact(server, true);
            }
          }, 3000);
        }
      };
      $scope.openChat = function(id, contact) {
        $scope.open = true;
        $scope.isChat = 0;
        if (!id && !contact) {
          if ($scope.currentContact) {
            $scope.currentContact.length = 0;
            setAllMessageReaded($scope.currentContact);
            scrollToBottom(null, 0);
          }
          return false;
        }
        if (!id) {
          id = contact.id;
        }
        if (isServer(id || contact.id) && isAnotherSeverConnected(id || contact.id)) {
          return false;
        }
        if ($scope.currentContact && $scope.currentContact.id === id && !(isServer(id))) {
          $scope.currentContact.length = 0;
          setAllMessageReaded($scope.currentContact);
          scrollToBottom(null, 0);
          return false;
        }
        (contact = contact || findContact('id', id)) && $scope.setSelected(contact);
        deleteNewMessages(id || contact.id);
        (!contact.ready || contact.ready === '-1') && inintContactReady(id || contact.id);
        if ($scope.contactReady.type === 0 && (!$scope.currentContact.messages || !$scope.currentContact.messages[0])) {
          $scope.getChatMessageList();
        } else {
          scrollToBottom(null, 0);
        }
        return setFocus();
      };
      $scope.switchContact = null;
      $scope.showSwitch = false;
      $scope.anotherSever = null;
      isAnotherSeverConnected = function(id) {
        var anotherSever, thisSever;
        if (!isServer(id)) {
          return false;
        }
        thisSever = findContact('id', id);
        if (id === 'ICHAT_STAFF_747') {
          anotherSever = findContact('id', 'ICHAT_STAFF_380');
        }
        if (id === 'ICHAT_STAFF_380') {
          anotherSever = findContact('id', 'ICHAT_STAFF_747');
        }
        if (anotherSever && anotherSever.existChat && anotherSever.ready === '2') {
          $scope.showSwitch = true;
          $scope.switchContact = thisSever;
          $scope.anotherSever = anotherSever;
          return true;
        }
        return false;
      };
      $scope.switchToAnotherSever = function() {
        $scope.setEvaluate(-1, true);
        return $timeout(function() {
          $scope.deleteContact($scope.anotherSever, true);
          return $timeout(function() {
            return $scope.openChat('', $scope.switchContact);
          }, 0);
        }, 1000);
      };
      getAnotherServer = function(id) {
        if (id === 'ICHAT_STAFF_747') {
          return findContact('id', 'ICHAT_STAFF_380');
        }
        if (id === 'ICHAT_STAFF_380') {
          return findContact('id', 'ICHAT_STAFF_747');
        }
      };
      setAllMessageReaded = function(contact) {
        var unreadMessages;
        if (!$scope.open) {
          return false;
        }
        unreadMessages = $filter('filter')(contact.messages, {
          receiverId: $scope.id,
          stat: '!2'
        }, true);
        return angular.forEach(unreadMessages, function(e, i) {
          if (e.stat === 2 || !e.id) {
            return;
          }
          e.stat = 2;
          return Socket.get({
            commandType: 3005,
            senderId: e.senderId,
            id: e.id,
            state: e.stat
          });
        });
      };
      $scope.openGroup = function(group) {
        $scope.open = true;
        group.img = 'group';
        $scope.setSelected(group);
        if (!$filter('filter')($scope.contacts, {
          id: group.id
        }, true)[0]) {
          $scope.contacts.push(group);
        }
        return setFocus();
      };
      setFocus = function() {
        var input, inputArea;
        input = document.getElementById('sent');
        inputArea = document.querySelector('.center .right .input-area');
        input.focus();
        input.style.height = "44px";
        return inputArea.style.height = '';
      };
      findContact = function(key, value) {
        var obj, result;
        result = null;
        obj = {};
        obj[key] = value;
        result = $filter('filter')($scope.contacts, obj, true)[0];
        return result;
      };

      /*过滤 */
      $scope.currentContact = null;
      $scope.contactReady = {
        type: 0,
        text: '分配客服中...',
        reset: function() {
          this.type = 0;
          return this.text = '分配客服中...';
        }
      };
      isServer = function(id) {
        return id === 'ICHAT_STAFF_747' || id === 'ICHAT_STAFF_380';
      };
      inintContactReady = function(id) {
        var server;
        if (isServer(id)) {
          server = findContact('id', id);
          $scope.contactReady.type++;
          $scope.contactReady.text = '分配客服中';
          if (server.ready && server.ready !== '-1') {
            return;
          }
          Socket.get({
            commandType: 4001,
            id: id
          });
          return server.ready = '1';
        } else {
          return $scope.contactReady.reset();
        }
      };
      scrollToBottom = function(scrollTop, time) {
        var ele;
        ele = document.getElementById('message-box');
        if (typeof time === "undefined") {
          time = 100;
        }
        if (ele) {
          if (scrollTop > 0) {
            return setTimeout(function() {
              return ele.scrollTop = ele.scrollHeight - scrollTop - ele.clientHeight + 80;
            }, time);
          } else {
            return setTimeout(function() {
              return ele.scrollTop = 10000;
            }, time);
          }
        }
      };
      $scope.listenKeyDown = function(e) {
        if (e.keyCode === 13 && e.ctrlKey) {
          return $scope.beforeSend('text', $scope.msg);
        }
      };
      $scope.beforeSend = function(type, src) {
        var msg;
        if (type === 'text' && src.length > 1000) {
          Messager.message({
            type: 'alert-warm',
            text: '您发送的内容太长',
            ok: '确定'
          });
          return null;
        }
        msg = {
          senderId: $scope.id,
          receiverId: $scope.currentContact.id || $scope.id,
          type: type,
          sendTime: getDateNow(),
          stat: $scope.currentContact.gid ? -2 : 0
        };
        if (type === 'text') {
          if (src !== '') {
            msg.content = src;
            $scope.msg = '';
            $scope.sent(msg);
          }
        } else {
          if (src[0]) {
            msg.content = src;
            Socket.notify.message(msg, $scope.currentContact);
          }
        }
        return setFocus();
      };
      $scope.sent = function(msg) {
        var msg_, sendToAll;
        sendToAll = false;
        if (!$scope.currentContact.gid) {
          sendToAll = true;
        }
        Socket.notify.message(msg, $scope.currentContact);
        msg_ = angular.copy(msg);
        msg_.commandType = 3001;
        delete msg_.senderId;
        delete msg_.sendTime;
        delete msg_.stat;
        if (sendToAll) {
          if ($scope.currentContact.receiverId) {
            msg_.receiverId = $scope.currentContact.receiverId;
            angular.forEach($scope.currentContact.receiverId.split(','), function(id, i) {
              var e;
              e = $filter('filter')($scope.contacts, {
                id: id
              }, true)[0];
              if (e && e.messages && e.messages[0] && !e.fakerMsgLength) {
                return e.fakerMsgLength = -1;
              } else if (e && e.messages) {
                return e.fakerMsgLength--;
              }
            });
            msg_.commandType = 3003;
          } else if ($filter('filter')($scope.contacts, {
            gid: msg_.receiverId
          }, true)[0]) {
            angular.forEach($filter('filter')($scope.contacts, {
              gid: msg_.receiverId
            }, true), function(e, i) {
              if (e.messages && e.messages[0] && !e.fakerMsgLength) {
                e.fakerMsgLength = -1;
              } else if (e.messages && e.messages[0]) {
                e.fakerMsgLength--;
              }
              return msg_.commandType = 3007;
            });
          } else {
            return;
          }
        }
        return Socket.get(msg_);
      };
      $scope.addNewMessage = function(msg) {
        replaySounds();
        msg.moveIn = true;
        $scope.newMessages.push(msg);
        $timeout(function() {
          return msg.moveIn = false;
        }, 100);
        return $timeout(function() {
          return msg.dontShowNew = true;
        }, 5000);
      };
      $scope.insertEmoticon = function(e) {
        var target;
        target = e.target;
        if (e.className !== '' && (target.parentNode.className.indexOf('emoticon')) !== -1) {
          return $scope.msg += '{{' + e.target.className + '}}';
        }
      };
      $scope.parseEmoticon = function(string) {
        var tempString;
        tempString = '<div class="single-smiley emoticon"><div class="{{class}}"></div></div>';
        return string.replace(/{{\w+}}/g, function(find) {
          find = find.replace(/[{}\s]/g, '');
          return tempString.replace('{{class}}', find);
        }).replace(/\n/g, '<br/>').replace(/\[em_([0-9]|[0-6][0-9]|7[0-5])\]/g, '<span class="emoji emoji-$1" ></span>');
      };
      sendFile = function(newFiles) {
        return $scope.upload(newFiles || $scope.files);
      };
      tempFiles = null;
      $scope.$watch('files', function(newFiles) {
        var files;
        if (!newFiles) {
          return null;
        }
        if (newFiles.length > 1) {
          Messager.alert('不支持多文件发送');
          return;
        }
        sendFile(newFiles);
        files = [];
        return $timeout(function() {
          var file, img, index, j, len;
          for (index = j = 0, len = newFiles.length; j < len; index = ++j) {
            img = newFiles[index];
            if (img.error) {
              continue;
            }
            file = {
              url: img.dataUrl || img.blobUrl,
              name: img.name,
              size: img.size,
              progress: 1,
              id: img.id,
              type: img.type.indexOf('image') !== -1 ? 'image' : 'file'
            };
            files.push(file);
            autoProgress.call(file);
          }
          $scope.beforeSend(file.type, files);
          return tempFiles = files;
        }, 300);
      });
      Socket.notify.fileMessage = function(fileInfo) {
        var contact, file, fileObj, id, msg, receiverId;
        id = fileInfo.fileId;
        receiverId = fileInfo.receiverId;
        contact = findContact('id', receiverId);
        file = null;
        msg = null;
        if (contact && contact.messages && contact.messages[0]) {
          angular.forEach(contact.messages, function(message, i) {
            var ref;
            if (file) {
              return false;
            }
            if (message.content && ((ref = message.content[0]) != null ? ref.id : void 0)) {
              file = $filter('filter')(message.content, {
                id: id
              }, true)[0];
              if (file) {
                return msg = message;
              }
            }
          });
        }
        console.log('file send success: ', msg);
        if (file) {
          fileObj = {
            name: file.name,
            size: file.size,
            progress: 100,
            resolved: true
          };
          if (fileInfo.tmpUrl && fileInfo.url) {
            fileObj.url = 'http://' + rootPath + '/' + path + fileInfo.tmpUrl;
            fileObj.originUrl = 'http://' + rootPath + '/' + path + fileInfo.url;
            file.url = fileObj.url;
            file.originUrl = fileObj.originUrl;
          } else {
            fileObj.downloadurl = 'http://' + rootPath + '/' + path + '/download.do?method=download&id=' + fileInfo.id;
          }
          if (contact.gid) {
            Socket.get({
              commandType: 3001,
              receiverId: receiverId,
              content: JSON.stringify([fileObj]),
              messageId: file.id,
              type: file.type,
              sendTime: getDateNow()
            });
          } else if (contact.receiverId) {
            Socket.get({
              commandType: 3003,
              receiverId: contact.receiverId,
              content: JSON.stringify([fileObj]),
              messageId: file.id,
              type: file.type,
              sendTime: getDateNow()
            });
          } else {
            Socket.get({
              commandType: 3007,
              receiverId: receiverId,
              content: JSON.stringify([fileObj]),
              messageId: file.id,
              type: file.type,
              sendTime: getDateNow()
            });
          }
          file.resolved = true;
          return delete file.id;
        }
      };
      newFile = function(img) {
        return {
          url: img.src,
          name: img.dataset.name,
          size: img.dataset.size,
          progress: img.progress || 1,
          id: img.id
        };
      };
      $scope.upload = function(files) {
        var file, i, j, len, results;
        if (files && files.length) {
          results = [];
          for (i = j = 0, len = files.length; j < len; i = ++j) {
            file = files[i];
            if (!file.error) {
              results.push($scope.uploadAfile(file));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
      $scope.uploadAfile = function(file) {
        var reader;
        reader = new FileReader();
        reader.readAsArrayBuffer(file);
        messageId++;
        file.id = String(messageId);
        file.receiverId = $scope.currentContact.id;
        return reader.onload = function(evt) {
          var fileAll, fileIdUnit8Array, fileTypeNameUnit8Array, fileTypeUnit8Array, receiverIdUnit8Array;
          console.log(file.name, file.id, file);
          fileTypeNameUnit8Array = Buffer.text2ua(file.name.split('.')[file.name.split('.').length - 1].toLowerCase(), 5);
          file.fileType = file.type.indexOf('image') !== -1 ? '1' : '0';
          fileTypeUnit8Array = Buffer.text2ua(file.fileType, 1);
          receiverIdUnit8Array = Buffer.text2ua(String(file.receiverId), 40);
          fileIdUnit8Array = Buffer.text2ua(String(file.id), 11);
          fileAll = Buffer.concat(Buffer.concat(Buffer.concat(Buffer.concat(fileTypeUnit8Array, fileTypeNameUnit8Array), fileIdUnit8Array), receiverIdUnit8Array), evt.target.result);
          return Socket.sendFile(fileAll);
        };
      };
      $scope.validate = function(file) {
        var extName;
        extName = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
        if ($filter('filter')(ErrorFileExtName, extName, true)[0]) {
          Messager.alert({
            text: '不支持的文件类型',
            ok: '确定'
          });
          file.error = true;
        }
        if (file.size > 1024 * 1024 * 3) {
          Messager.alert({
            text: '上传文件不大于3M',
            ok: '确定'
          });
          return file.error = true;
        }
      };
      $scope.$watch('open', function(n, o) {
        var ref;
        if (n) {
          return deleteNewMessages((ref = $scope.currentContact) != null ? ref.id : void 0);
        }
      });
      deleteNewMessages = function(id) {
        if (!id) {
          return;
        }
        return $scope.newMessages = $filter('filter')($scope.newMessages, function(msg, index) {
          return msg.senderId !== id;
        });
      };
      window.accessAngular = {
        msgChange: function(value) {
          $scope.msg = value;
          setFocus();
          return $scope.$apply();
        }
      };
      sounds = null;
      replaySounds = function() {
        if (!sounds) {
          sounds = document.getElementById('newMessageAlert');
        }
        if (sounds) {
          if (sounds.play) {
            sounds.pause();
          }
          sounds.currentTime = 0;
          return sounds.play();
        }
      };
      $window.onbeforeunload = function() {
        return storeRecentContactsNow();
      };
      storeRecentContactsNow = function() {
        var contacts, newRecentContacts;
        newRecentContacts = [];
        contacts = $filter('filter')($scope.contacts, {
          existChat: true
        }, true);
        contacts = $filter('orderBy')(contacts, 'activeLevel');
        contacts = contacts.slice(-Storage.maxContactsLenghth);
        angular.forEach(contacts, function(e, i) {
          if (e.messages && e.messages[0]) {
            return newRecentContacts.push({
              id: e.id,
              activeLevel: i === contacts.length - 1 ? 1 : 0,
              messages: [],
              text: e.text,
              senderId: e.senderId
            });
          }
        });
        console.log(newRecentContacts);
        return Storage.setRecentContactsForAccount($scope.id, newRecentContacts);
      };
      $scope.showUploadOptions = false;
      return $scope.delayHideUploadOptions = function() {
        return $timeout(function() {
          return $scope.showUploadOptions = false;
        }, 500);
      };
    }
  ]).value('version', '0.0.1');

  setTimeout(function() {
    if (!angular.element(document.getElementById('custom-service')).scope()) {
      return angular.bootstrap(document.getElementById("custom-service"), ['custom-service']);
    }
  }, 0);

}).call(this);
