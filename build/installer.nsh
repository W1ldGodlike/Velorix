; FluxAlloy NSIS hooks (electron-builder).
; Удаление app-data — только по явному согласию пользователя (кнопка «Нет» по умолчанию).

!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Удалить пользовательские данные (папка app-data: настройки, загрузки, журналы, кэш)?$\n$\n«Нет» — оставить файлы на диске." IDYES RemoveFluxAppData IDNO DoneFluxUninst
  RemoveFluxAppData:
    IfFileExists "$INSTDIR\app-data\*.*" 0 DoneRemoveFluxAppData
    RMDir /r "$INSTDIR\app-data"
  DoneRemoveFluxAppData:
  DoneFluxUninst:
!macroend
