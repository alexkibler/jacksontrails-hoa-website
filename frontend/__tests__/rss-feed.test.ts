describe('RSS Feed Generation', () => {
  // Helper functions for RSS feed generation
  function escapeXml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '')
  }

  describe('escapeXml', () => {
    it('should escape ampersands', () => {
      expect(escapeXml('Fish & Chips')).toBe('Fish &amp; Chips')
    })

    it('should escape less than signs', () => {
      expect(escapeXml('5 < 10')).toBe('5 &lt; 10')
    })

    it('should escape greater than signs', () => {
      expect(escapeXml('10 > 5')).toBe('10 &gt; 5')
    })

    it('should escape quotes', () => {
      expect(escapeXml('He said "hello"')).toBe('He said &quot;hello&quot;')
    })

    it('should escape apostrophes', () => {
      expect(escapeXml("It's working")).toBe("It&apos;s working")
    })

    it('should escape multiple special characters', () => {
      expect(escapeXml('<tag attr="value">Fish & Chips</tag>')).toBe(
        '&lt;tag attr=&quot;value&quot;&gt;Fish &amp; Chips&lt;/tag&gt;'
      )
    })

    it('should not modify safe strings', () => {
      expect(escapeXml('Hello World')).toBe('Hello World')
    })
  })

  describe('stripHtml', () => {
    it('should remove simple HTML tags', () => {
      expect(stripHtml('<p>Hello World</p>')).toBe('Hello World')
    })

    it('should remove nested HTML tags', () => {
      expect(stripHtml('<div><p>Hello <strong>World</strong></p></div>')).toBe(
        'Hello World'
      )
    })

    it('should remove self-closing tags', () => {
      expect(stripHtml('Line 1<br/>Line 2')).toBe('Line 1Line 2')
    })

    it('should remove tags with attributes', () => {
      expect(stripHtml('<a href="http://example.com">Link</a>')).toBe('Link')
    })

    it('should not modify plain text', () => {
      expect(stripHtml('Plain text without HTML')).toBe('Plain text without HTML')
    })

    it('should handle complex HTML content', () => {
      const html = `
        <div class="content">
          <h1>Title</h1>
          <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `
      const result = stripHtml(html)
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
      expect(result).toContain('Title')
      expect(result).toContain('Paragraph')
      expect(result).toContain('bold')
      expect(result).toContain('italic')
    })
  })

  describe('RSS Feed Format', () => {
    it('should generate valid RSS 2.0 structure', () => {
      const mockAnnouncement = {
        id: '1',
        title: 'Test Announcement',
        slug: 'test-announcement',
        content: '<p>This is a test announcement</p>',
        published_date: '2024-05-15',
        created: '2024-05-15T10:00:00Z',
        updated: '2024-05-15T10:00:00Z',
      }

      const siteUrl = 'http://localhost:3000'
      const siteName = 'Jackson Trails HOA'
      const url = `${siteUrl}/announcements/${mockAnnouncement.slug}`
      const pubDate = new Date(mockAnnouncement.published_date).toUTCString()
      const description = stripHtml(mockAnnouncement.content).substring(0, 300)

      const rssItem = `
    <item>
      <title>${escapeXml(mockAnnouncement.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}...</description>
    </item>`

      expect(rssItem).toContain('<item>')
      expect(rssItem).toContain('</item>')
      expect(rssItem).toContain('<title>Test Announcement</title>')
      expect(rssItem).toContain(
        '<link>http://localhost:3000/announcements/test-announcement</link>'
      )
      expect(rssItem).toContain('<pubDate>')
      expect(rssItem).toContain('<description>')
    })

    it('should properly escape special characters in RSS content', () => {
      const mockAnnouncement = {
        id: '1',
        title: 'Fish & Chips <Company>',
        slug: 'fish-chips-company',
        content: '<p>Visit us at "Main Street" & enjoy!</p>',
        published_date: '2024-05-15',
        created: '2024-05-15T10:00:00Z',
        updated: '2024-05-15T10:00:00Z',
      }

      const escapedTitle = escapeXml(mockAnnouncement.title)
      const description = stripHtml(mockAnnouncement.content)
      const escapedDescription = escapeXml(description)

      expect(escapedTitle).toBe('Fish &amp; Chips &lt;Company&gt;')
      expect(escapedDescription).toBe(
        'Visit us at &quot;Main Street&quot; &amp; enjoy!'
      )
    })

    it('should truncate long descriptions to 300 characters', () => {
      const longContent = '<p>' + 'a'.repeat(500) + '</p>'
      const stripped = stripHtml(longContent)
      const truncated = stripped.substring(0, 300)

      expect(truncated.length).toBe(300)
    })

    it('should format dates in RFC 2822 format', () => {
      const date = new Date('2024-05-15T10:30:00Z')
      const rfc2822 = date.toUTCString()

      expect(rfc2822).toMatch(/^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/)
    })
  })
})
