import searchData from '../../../json/search.json';
import React, { useEffect, useState } from 'react';
import SearchResult, { type ISearchItem } from './SearchResult';

const SearchModal = () => {
  const [searchString, setSearchString] = useState('');

  // handle input change
  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchString(e.currentTarget.value.replace('\\', '').toLowerCase());
  };

  // generate search result
  const doSearch = (searchData: ISearchItem[]) => {
    const regex = new RegExp(`${searchString}`, 'gi');
    if (searchString === '') {
      return [];
    } else {
      const searchResult = searchData.filter((item) => {
        const title = item.frontmatter.title.toLowerCase().match(regex);
        const description = item.frontmatter.description?.toLowerCase().match(regex);
        const categories = item.frontmatter.categories?.join(' ').toLowerCase().match(regex);
        const tags = item.frontmatter.tags?.join(' ').toLowerCase().match(regex);

        if (title || description || categories || tags) {
          return item;
        }
      });
      return searchResult;
    }
  };

  // get search result
  const startTime = performance.now();
  const searchResult = doSearch(searchData);
  const endTime = performance.now();
  const totalTime = ((endTime - startTime) / 1000).toFixed(3);

  useEffect(() => {
    const searchModal = document.getElementById('searchModal') as HTMLElement | null;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    const searchModalTriggers = document.querySelectorAll('[data-search-trigger]');
    const searchModalOverlay = document.getElementById('searchModalOverlay') as HTMLElement | null;

    // 检查必要元素是否存在
    if (!searchModal || !searchInput || !searchModalOverlay || searchModalTriggers.length === 0) {
      console.warn('Search modal elements not found');
      return;
    }

    let selectedIndex = -1;
    const cleanupFunctions: (() => void)[] = [];

    // 更新选中状态
    const updateSelection = () => {
      const searchResultItems = document.querySelectorAll('#searchItem') as NodeListOf<HTMLElement>;
      searchResultItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add('search-result-item-active');
        } else {
          item.classList.remove('search-result-item-active');
        }
      });

      // 滚动到选中项
      if (selectedIndex >= 0 && searchResultItems[selectedIndex]) {
        searchResultItems[selectedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    };

    // 重置选中状态
    const resetSelection = () => {
      selectedIndex = -1;
      updateSelection();
    };

    // 打开模态框
    const openModal = () => {
      const onTransitionEnd = () => {
        searchInput.focus();
        searchModal.removeEventListener('transitionend', onTransitionEnd);
      };

      searchModal.addEventListener('transitionend', onTransitionEnd);
      searchModal.classList.add('show');
      resetSelection(); // 重置选中状态
    };

    // 关闭模态框
    const closeModal = () => {
      searchModal.classList.remove('show');
      resetSelection(); // 重置选中状态
    };

    // 绑定打开按钮事件
    searchModalTriggers.forEach((button) => {
      const handleClick = (e: Event) => {
        e.preventDefault();
        openModal();
      };

      button.addEventListener('click', handleClick);

      // 存储清理函数
      cleanupFunctions.push(() => {
        button.removeEventListener('click', handleClick);
      });
    });

    // 绑定覆盖层点击事件
    const handleOverlayClick = (e: Event) => {
      // 只有点击覆盖层本身时才关闭，避免事件冒泡
      if (e.target === searchModalOverlay) {
        closeModal();
      }
    };
    searchModalOverlay.addEventListener('click', handleOverlayClick);
    cleanupFunctions.push(() => {
      searchModalOverlay.removeEventListener('click', handleOverlayClick);
    });

    // 键盘导航
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在模态框显示时处理键盘事件
      if (!searchModal.classList.contains('show')) {
        return;
      }

      const searchResultItems = document.querySelectorAll('#searchItem') as NodeListOf<HTMLElement>;
      const itemCount = searchResultItems.length;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (itemCount > 0) {
            selectedIndex = selectedIndex <= 0 ? itemCount - 1 : selectedIndex - 1;
            updateSelection();
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (itemCount > 0) {
            selectedIndex = selectedIndex >= itemCount - 1 ? 0 : selectedIndex + 1;
            updateSelection();
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (itemCount > 0) {
            let targetLink: HTMLAnchorElement | null = null;

            if (selectedIndex >= 0 && selectedIndex < itemCount) {
              // 有选中项，点击选中项的链接
              targetLink = searchResultItems[selectedIndex].querySelector('a') as HTMLAnchorElement | null;
            } else {
              // 没有选中项，点击第一项的链接
              targetLink = searchResultItems[0].querySelector('a') as HTMLAnchorElement | null;
            }

            if (targetLink) {
              targetLink.click();
              closeModal(); // 点击后关闭模态框
            }
          }
          break;

        default:
          // 其他按键重置选中状态，让用户重新用方向键选择
          if (event.key.length === 1) {
            // 只对字符键重置
            resetSelection();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    cleanupFunctions.push(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });

    // 监听搜索结果变化，重置选中状态
    const observeSearchResults = () => {
      const searchResultsContainer = document.querySelector('#searchResults, .search-results');
      if (searchResultsContainer) {
        const observer = new MutationObserver(() => {
          resetSelection(); // 搜索结果变化时重置选中状态
        });

        observer.observe(searchResultsContainer, {
          childList: true,
          subtree: true
        });

        cleanupFunctions.push(() => {
          observer.disconnect();
        });
      }
    };

    // 延迟观察搜索结果，确保 DOM 已渲染
    setTimeout(observeSearchResults, 0);

    // 返回清理函数
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div id="searchModal" className="search-modal">
      <div id="searchModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <label htmlFor="searchInput" className="absolute left-7 top-[calc(50%-7px)]">
            <span className="sr-only">search icon</span>
            {searchString ? (
              <svg
                onClick={() => setSearchString('')}
                viewBox="0 0 512 512"
                height="18"
                width="18"
                className="hover:text-red-500 cursor-pointer -mt-0.5 transition-colors"
              >
                <title>close icon</title>
                <path
                  fill="currentcolor"
                  d="M256 512A256 256 0 10256 0a256 256 0 100 512zM175 175c9.4-9.4 24.6-9.4 33.9.0l47 47 47-47c9.4-9.4 24.6-9.4 33.9.0s9.4 24.6.0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6.0 33.9s-24.6 9.4-33.9.0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9.0s-9.4-24.6.0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6.0-33.9z"
                ></path>
              </svg>
            ) : (
              <svg viewBox="0 0 512 512" height="18" width="18" className="-mt-0.5">
                <title>search icon</title>
                <path
                  fill="currentcolor"
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8.0 45.3s-32.8 12.5-45.3.0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9.0 208S93.1.0 208 0 416 93.1 416 208zM208 352a144 144 0 100-288 144 144 0 100 288z"
                ></path>
              </svg>
            )}
          </label>
          <input
            id="searchInput"
            placeholder="搜索..."
            className="search-wrapper-header-input"
            type="input"
            name="search"
            value={searchString}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
        <SearchResult searchResult={searchResult} searchString={searchString} />
        <div className="search-wrapper-footer">
          <span className="flex items-center">
            <kbd>
              <svg width="14" height="14" fill="currentcolor" viewBox="0 0 16 16">
                <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 011.506.0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 01-.753-1.659z"></path>
              </svg>
            </kbd>
            <kbd>
              <svg width="14" height="14" fill="currentcolor" viewBox="0 0 16 16">
                <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 001.506.0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 00-.753 1.659z"></path>
              </svg>
            </kbd>
            导航
          </span>
          <span className="flex items-center">
            <kbd>
              <svg width="12" height="12" fill="currentcolor" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M14.5 1.5a.5.5.0 01.5.5v4.8a2.5 2.5.0 01-2.5 2.5H2.707l3.347 3.346a.5.5.0 01-.708.708l-4.2-4.2a.5.5.0 010-.708l4-4a.5.5.0 11.708.708L2.707 8.3H12.5A1.5 1.5.0 0014 6.8V2a.5.5.0 01.5-.5z"
                ></path>
              </svg>
            </kbd>
            选择
          </span>
          {searchString && (
            <span>
              <strong>{searchResult.length} </strong> results - in <strong>{totalTime} </strong> 秒
            </span>
          )}
          <span>
            <kbd>ESC</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
