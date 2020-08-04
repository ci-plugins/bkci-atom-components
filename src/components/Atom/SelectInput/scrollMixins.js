export default {
    computed: {
        hasDropMenu () {
            return this.$refs.dropMenu ? this.$refs.dropMenu : false
        },
        pixelsToPointerTop () {
            let pixelsToPointerTop = 0
            let groupItemHeight = 0
            if (this.hasDropMenu) {
                if (this.hasGroup) {
                    for (let i = 0; i < this.selectedGroupPointer; i++) {
                        groupItemHeight += this.$refs.dropMenu.children[0].children[i].offsetHeight
                    }
                    for (let j = 0; j <= this.selectedPointer; j++) {
                        pixelsToPointerTop += (this.$refs.dropMenu.children[0].children[this.selectedGroupPointer].children[1 + j].offsetHeight)
                    }
                    this.selectedGroupPointer = !this.selectedGroupPointer ? 0 : this.selectedGroupPointer
                    pixelsToPointerTop += groupItemHeight
                } else {
                    for (let i = 0; i < this.selectedPointer; i++) {
                        pixelsToPointerTop += this.$refs.dropMenu.children[0].children[i].offsetHeight
                    }
                }
            }

            return pixelsToPointerTop
        },
        selectedElementHeight () {
            let element
            if (this.hasGroup) {
                element = this.hasDropMenu ? this.$refs.dropMenu.children[0].children[this.selectedGroupPointer].children[this.selectedPointer] : false
            } else {
                element = this.hasDropMenu ? this.$refs.dropMenu.children[0].children[this.selectedPointer] : false
            }
            return element ? element.offsetHeight : 0
        },
        pixelsToPointerBottom () {
            return this.pixelsToPointerTop + this.selectedElementHeight
        }
    },
    methods: {
        getViewPort () {
            let top = 0
            let bottom = 0
            if (this.hasDropMenu) {
                const dropMenu = this.$refs.dropMenu
                top = dropMenu.scrollTop
                bottom = dropMenu.scrollTop + dropMenu.offsetHeight
            }
            return {
                top,
                bottom
            }
        },
        adjustViewPort (isLeapfrog) {
            const viewPort = this.getViewPort()
            if (this.pixelsToPointerTop <= viewPort.top) {
                return this.scrollTo(this.pixelsToPointerTop)
            } else if (this.pixelsToPointerBottom >= viewPort.bottom) {
                this.scrollTo(isLeapfrog ? viewPort.top + this.selectedElementHeight + 36 : viewPort.top + this.selectedElementHeight)
            }
        },

        scrollTo (position) {
            if (this.hasDropMenu) {
                this.$refs.dropMenu.scrollTop = position || null
            }
        },

        handleKeyup () {
            if (this.hasGroup) {
                if (this.selectedGroupPointer >= 0 && this.selectedPointer > 0) {
                    this.selectedPointer--
                    this.adjustViewPort()
                } else if (this.selectedGroupPointer > 0 && this.selectedPointer === 0) {
                    this.selectedGroupPointer--
                    this.selectedPointer = this.filteredList[this.selectedGroupPointer].children.length - 1
                    this.adjustViewPort(true)
                }
            } else {
                if (this.selectedPointer > 0) {
                    this.selectedPointer--
                    this.adjustViewPort()
                }
            }
        },

        handleKeydown () {
            if (!this.optionListVisible) this.optionListVisible = true
            if (this.hasGroup) {
                if (this.selectedGroupPointer <= this.filteredList.length - 1 && this.selectedPointer < this.filteredList[this.selectedGroupPointer].children.length - 1) {
                    this.selectedPointer++
                    this.adjustViewPort()
                } else if (this.selectedGroupPointer < this.filteredList.length - 1 && this.selectedPointer === this.filteredList[this.selectedGroupPointer].children.length - 1) {
                    this.selectedGroupPointer++
                    this.selectedPointer = 0
                    this.adjustViewPort(true)
                }
            } else {
                if (this.selectedPointer < this.filteredList.length - 1) {
                    this.selectedPointer++
                    this.adjustViewPort()
                }
            }
        },
        handleEnterOption () {
            let option = {}
            if (this.hasGroup) {
                option = this.filteredList[this.selectedGroupPointer].children[this.selectedPointer]
            } else {
                option = this.filteredList[this.selectedPointer]
            }
            if (option && !option.disabled) {
                this.handleChange(this.name, option.id)
                this.handleBlur()
            }
        }
    }
}
