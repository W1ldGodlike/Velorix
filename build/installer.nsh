; Velorix NSIS hooks (electron-builder).
; Удаление app-data — только по явному согласию пользователя (кнопка «Нет» по умолчанию).

!macro customInstall
  ; §14 — контекстное меню Проводника (HKCU) после установки.
  ExecWait '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --velorix-install-register-explorer-menu' $0
  ExecWait '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --velorix-install-register-open-with' $0
!macroend

!macro customUnInstall
  ExecWait '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --velorix-install-unregister-explorer-menu' $0
  ExecWait '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" --velorix-install-unregister-open-with' $0
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Удалить пользовательские данные (папка app-data: настройки, загрузки, журналы, кэш)?$\n$\n«Нет» — оставить файлы на диске." IDYES RemoveFluxAppData IDNO DoneFluxUninst
  RemoveFluxAppData:
    IfFileExists "$INSTDIR\app-data\*.*" 0 DoneRemoveFluxAppData
    RMDir /r "$INSTDIR\app-data"
  DoneRemoveFluxAppData:
  DoneFluxUninst:
!macroend
