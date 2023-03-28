declare type ActionsListArtifactsForRepoResponseArtifactsItem = {
  archive_download_url: string
  created_at: string
  expired: boolean
  expires_at: string
  id: number
  name: string
  node_id: string
  size_in_bytes: number
  url: string
}

declare module 'parse-duration' {
  export = parse

  /**
   * convert `str` to ms
   */
  function parse(str: string): number
}
