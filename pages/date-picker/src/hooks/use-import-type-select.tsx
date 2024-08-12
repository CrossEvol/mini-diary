import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState } from 'react'

const importTypeEnum = {
  default: 'Default',
  override: 'Override',
  combine: 'Combine'
}

const useImportTypeSelect = () => {
  const [importType, setImportType] = useState(importTypeEnum.default)

  const ImportTypeSelect = (
    <Select
      defaultValue={importType}
      onValueChange={(type) => setImportType(type)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ImportType" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={importTypeEnum.default}>
          {importTypeEnum.default}
        </SelectItem>
        <SelectItem value={importTypeEnum.override}>
          {importTypeEnum.override}
        </SelectItem>
        <SelectItem value={importTypeEnum.combine}>
          {importTypeEnum.combine}
        </SelectItem>
      </SelectContent>
    </Select>
  )

  return {
    shouldBeOverridden:
      importType === importTypeEnum.override ||
      importType === importTypeEnum.default,
    ImportTypeSelect
  }
}

export default useImportTypeSelect
